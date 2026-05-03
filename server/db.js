require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "docentes_db",
});

connection.connect((err) => {
  if (err) {
    console.log("Error al conectar la bd", err);
    return;
  }

  console.log("Conexion exitosa .....");
});

module.exports = connection;
