require("dotenv").config();

const mysql = require("mysql2");

const host = process.env.DB_HOST?.trim() || "localhost";
const user = process.env.DB_USER?.trim() || "root";
const password = process.env.DB_PASSWORD?.trim() || "";
const database = process.env.DB_NAME?.trim() || "pacientes_db";
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "ER_BAD_DB_ERROR") {
      console.error(
        `Error al conectar la bd: la base de datos "${database}" no existe.`
      );
    } else {
      console.error("Error al conectar la bd", err);
    }
    return;
  }

  console.log("Conexión exitosa a MySQL");
  connection.release();
});

module.exports = pool;
