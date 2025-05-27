const db = require("../lib/db.js");

exports.getUserOrders = (req, res) => {
  const userId = req.userData.Id;
  db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: "Error obtaining orders" });
      }
      res.status(200).send(result);
    }
  );
};

exports.createOrder = (req, res) => {
  const userId = req.userData.Id;
  const products = req.body.products; // [{ id, quantity }]

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).send({ message: "No hay productos en el pedido" });
  }

  // Paso 1: Crear orden inicial con total en 0
  db.query(
    "INSERT INTO orders (user_id, created_time, total) VALUES (?, NOW(), ?)",
    [userId, 0],
    (err, result) => {
      if (err) {
        console.error("Error al insertar en orders:", err);
        return res.status(500).send({ message: "Error creando pedido" });
      }

      const orderId = result.insertId; // Necesario para details
      let total = 0;
      const orderItems = [];
      const productIds = products.map((p) => p.id);

      // Paso 2: Obtener precios de los productos
      db.query(
        "SELECT id, price, name FROM products WHERE id IN (?)",
        [productIds],
        (err, priceResults) => {
          if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).send({ message: "Error validando productos" });
          }

          if (priceResults.length !== productIds.length) {
            return res.status(400).send({ message: "Uno o más productos no existen" });
          }

          const priceMap = {};
          priceResults.forEach((p) => (priceMap[p.id] = p.price));

          for (const p of products) {
            const price = priceMap[p.id];
            if (!price) return res.status(400).send({ message: "Producto inválido" });

            total += price * p.quantity;
            orderItems.push([orderId, p.id, p.quantity, price]); // 🚨 Añadir orderId aquí
          }

          // Paso 3: Insertar detalles del pedido con order_id
          db.query(
            "INSERT INTO details (order_id, product_id, quantity, price) VALUES ?",
            [orderItems],
            (err) => {
              if (err) {
                console.error("Error guardando detalles:", err);
                return res.status(500).send({ message: "Error guardando detalles" });
              }

              // Paso 4: Actualizar total en orders
              db.query(
                "UPDATE orders SET total = ? WHERE id = ?",
                [total, orderId],
                (err) => {
                  if (err) {
                    console.error("Error actualizando total:", err);
                    return res.status(500).send({ message: "Error actualizando total" });
                  }

                  // Paso 5: Actualizar stock de productos
                  products.forEach((p) => {
                    db.query(
                      "UPDATE products SET stock = stock - ? WHERE id = ?",
                      [p.quantity, p.id],
                      (err) => {
                        if (err) {
                          console.error(`Error actualizando stock del producto ${p.id}:`, err);
                        }
                      }
                    );
                  });

                  // Éxito final
                  res.status(201).send({
                    message: "Pedido creado correctamente",
                    orderId,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};