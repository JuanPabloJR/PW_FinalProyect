const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../lib/db.js");
const uuid = require("uuid");

exports.getAllUsers = (req, res) => {
  db.query("SELECT id, username, registered, rol FROM userss", (err, results) => {
    if (err) return res.status(500).send({ message: "Error fetching users" });
    res.status(200).send(results);
  });
};

exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err)
      return res.status(500).send({ message: "Error fetching products" });
    res.status(200).send(results);
  });
};

exports.updateProduct = (req, res) => {
  const { name, price, description, stock } = req.body;
  const productId = req.params.id;

  const sql = `
  UPDATE products
  SET name = ?, price = ?, description = ?, stock = ?
  WHERE id = ?
`;

  db.query(sql, [name, price, description, stock, productId], (err, result) => {
    if (err)
      return res
        .status(500)
        .send({
          message: "Error actualizando producto, No dejes campos vacíos",
        });
    res.send({ message: "Producto actualizado", confirmation: 1 });
  });
};

exports.createProduct = (req, res) => {
  const { name, description, price, stock } = req.body;

  const sql = `INSERT INTO products (name,  description, price, stock) VALUES (?, ?, ?, ?)`;

  db.query(sql, [name, description, price, stock], (err, result) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Producto no creado correctamente", err: err });
    res.send({
      confirmation: result,
      message: "Producto creado correctamente",
    });
  });
};

exports.createAdminUser = (req, res) => {
  const { username, password, rol } = req.body;
  const id = uuid.v4();

  // Hashear la contraseña antes de guardar
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({ message: "Error encriptando contraseña", err });
    }
    const sql = `INSERT INTO userss (id, username, password, rol) VALUES (?, ?, ?, ?)`;
    db.query(sql, [id, username, hash, rol], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).send({ message: "Username already in use" });
        }
        return res.status(500).send({ message: "Error creando al usuario", err });
      }
      res.send({
        confirmation: result,
        message: "Usuario administrador creado correctamente",
      });
    });
  });
};