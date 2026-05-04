require("dotenv").config();

const mysql = require("mysql2");

const host = process.env.DB_HOST?.trim() || "localhost";
const user = process.env.DB_USER?.trim() || "root";
const password = process.env.DB_PASSWORD?.trim() || "";
const database = process.env.DB_NAME?.trim() || "pacientes_db";
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const poolConfig = {
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

const createDatabaseIfNeeded = () => {
  return new Promise((resolve, reject) => {
    const initConnection = mysql.createConnection({
      host,
      user,
      password,
      port,
    });

    initConnection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      initConnection.query(
        `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        (err) => {
          initConnection.end();
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  });
};

const createTableIfNeeded = () => {
  return new Promise((resolve, reject) => {
    const sql = `CREATE TABLE IF NOT EXISTS pacientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      correo VARCHAR(255) NOT NULL,
      telefono VARCHAR(50) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      especialidad_medicarequerida VARCHAR(255),
      identificacion VARCHAR(255) NOT NULL,
      dimetu_edad INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    pool.query(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const initPool = async () => {
  pool = mysql.createPool(poolConfig);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar la bd", err);
      return;
    }

    console.log("Conexión exitosa a MySQL");
    connection.release();
  });

  await createTableIfNeeded();
};

const initializeDatabase = async () => {
  try {
    await createDatabaseIfNeeded();
    await initPool();
  } catch (err) {
    console.error("Error al inicializar la base de datos", err);
    process.exit(1);
  }
};

initializeDatabase();

const query = (...args) => {
  if (!pool) {
    throw new Error("Pool MySQL no está inicializado aún");
  }
  return pool.query(...args);
};

const execute = (...args) => {
  if (!pool) {
    throw new Error("Pool MySQL no está inicializado aún");
  }
  return pool.execute(...args);
};

const getConnection = (cb) => {
  if (!pool) {
    cb(new Error("Pool MySQL no está inicializado aún"));
    return;
  }
  return pool.getConnection(cb);
};

module.exports = {
  query,
  execute,
  getConnection,
};
