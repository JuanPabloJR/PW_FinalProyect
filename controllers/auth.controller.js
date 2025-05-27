const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../lib/db.js");
const uuid = require("uuid");

exports.register = (req, res) => {
  // Aquí insertas el usuario en la base de datos
  const { username, password } = req.body;
  const rol = req.body.rol || "user";

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        message: "Error hashing password",
        error: err.message,
      });
    }

    const userId = uuid.v4();

    db.query(
      "INSERT INTO userss (id, username, password, registered, rol) VALUES (?, ?, ?, NOW(), ?)",
      [userId, username, hash, rol],
      (err, result) => {
        if (err) {
          // Si el username es único, MySQL lanza error si ya existe
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).send({
              message: "Username already in use",
            });
          }

          return res.status(500).send({
            message: "Error inserting user",
            error: err,
          });
        }

        return res.status(201).send({
          message: "Registered successfully",
        });
      }
    );
  });
};

exports.login = (req, res) => {
  // Aquí buscas usuario, comparas password, generas token
    db.query(
    "SELECT * FROM userss WHERE username = ?",
    [req.body.username],
    (err, result) => {
      if (err || !result.length) {
        return res
          .status(400)
          .send({ message: "Username or password incorrect" });
      }

      bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
        if (bErr || !bResult) {
          return res
            .status(400)
            .send({ message: "Username or password incorrect" });
        }

        const token = jwt.sign(
          {
            username: result[0].username,
            userId: result[0].id,
            Id: result[0].user_id,
            rol: result[0].rol
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        const { password, ...userData } = result[0];

        return res.status(200).send({
          message: "Logged In",
          token,
          user: userData,
        });
      });
    }
  );
};
