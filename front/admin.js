// admin.js - Lógica para el panel de administración

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const usersList = document.getElementById("usersList");
  const productsList = document.getElementById("productsList");

  // Cerrar sesión
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  // Cargar usuarios
  document.getElementById("loadUsersBtn").onclick = async () => {
    usersList.innerHTML = "Cargando...";

    fetch("http://localhost:3000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        usersList.innerHTML = "";
        data.forEach((u) => {
          const li = document.createElement("li");
          li.textContent = `Usuario: ${u.username} | rol: ${u.rol}`;
          usersList.appendChild(li);
        });
      })
      .catch((err) => {
        console.error("Error al cargar usuarios:", err);
        usersList.innerHTML = "Error al cargar usuarios";
      });
  };

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("registerUser").value;
      const rol = document.getElementById("registerRol").value;
      const password = document.getElementById("registerPassword").value;
      const password_repeat = document.getElementById("registerPassword_repeat").value;

      fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, rol, password, password_repeat }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.ok) {
            console.log("Registro exitoso, ahora puedes iniciar sesión");
            registerForm.reset();
          } else {
            console.log(data.message || "Error al registrarse");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  // Cargar productos
  document.getElementById("loadProductsBtn").onclick = () => {
    productsList.innerHTML = "Cargando...";

    fetch("http://localhost:3000/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        productsList.innerHTML = "";
        data.forEach((p) => {
          const li = document.createElement("li");
          li.textContent = `ID: ${p.id} | ${p.name} | $${p.price} | Stock: ${p.stock}`;
          productsList.appendChild(li);
        });
      })
      .catch((err) => {
        productsList.innerHTML = "Error al cargar productos";
      });
  };

  // Crear producto
  document
    .getElementById("createProductForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("productName").value;
      const description = document.getElementById("productDescription").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const stock = parseInt(document.getElementById("productStock").value);

      fetch("http://localhost:3000/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, price, stock }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message || "Producto creado");
          document.getElementById("createProductForm").reset();
        })
        .catch((err) => {
          console.error("Error al crear producto:", err);
        });
    });

  // Actualizar producto
  document.getElementById("updateProductForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("updateProductId").value;
      let name = document.getElementById("updateProductName").value;
      let description = document.getElementById("updateProductDescription").value;
      let price = parseFloat(document.getElementById("updateProductPrice").value);
      let stock = parseInt(document.getElementById("updateProductStock").value);

      fetch(`http://localhost:3000/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, price, stock }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message || "Producto actualizado");
          document.getElementById("updateProductForm").reset();
        })
        .catch((err) => {
          console.error("Error al actualizar producto:", err);
        });
    });

  // Autocompletar info de producto al escribir el ID
  document.getElementById("updateProductId").addEventListener("change", (e) => {
    const id = e.target.value;
    if (!id) return;

    fetch(`http://localhost:3000/admin/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const prod = data.find((p) => String(p.id) === String(id));
        if (prod) {
          document.getElementById("updateProductName").value = prod.name;
          document.getElementById("updateProductDescription").value =
            prod.description;
          document.getElementById("updateProductPrice").value = prod.price;
          document.getElementById("updateProductStock").value = prod.stock;
        } else {
          document.getElementById("updateProductName").value = "";
          document.getElementById("updateProductDescription").value = "";
          document.getElementById("updateProductPrice").value = "";
          document.getElementById("updateProductStock").value = "";
        }
      })
      .catch((err) => {
        console.error("Error al buscar producto:", err);
        document.getElementById("updateProductName").value = "";
        document.getElementById("updateProductDescription").value = "";
        document.getElementById("updateProductPrice").value = "";
        document.getElementById("updateProductStock").value = "";
      });
  });
});