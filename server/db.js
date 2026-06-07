require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;

// Avoid opening a real DB connection during tests to prevent leaked handles
if (process.env.NODE_ENV !== "test") {
  connection.connect((err) => {
    if (err) {
      console.log("Error al conectar la bd", err);
      return;
    }

    console.log("Conexion exitosa .....");
  });
}

module.exports = connection;
