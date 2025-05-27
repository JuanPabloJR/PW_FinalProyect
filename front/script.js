// Lógica para login y registro

document.addEventListener("DOMContentLoaded", () => {
  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

        fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        .then(data => data.json())
        .then(data => {
          if (data.user && data.user.rol === "admin") {
            localStorage.setItem("token", data.token);
            console.log("Login exitoso");
            window.location.href = "admin.html";
          } else if (data.token) {
            localStorage.setItem("token", data.token);
            console.log("Login exitoso");
            window.location.href = "productos-carrito.html";
          } else {
            console.log(data.message || "Error al iniciar sesión");
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // Registro
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const password_repeat = document.getElementById("registerPassword_repeat").value;

      fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, password_repeat }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.ok) {
            console.log("Registro exitoso, ahora puedes iniciar sesión");
          } else {
            console.log(data.message || "Error al registrarse");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
});
