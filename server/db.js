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
let isReady = false;

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
          if (err) {
            initConnection.end();
            reject(err);
            return;
          }
          initConnection.end();
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
  return new Promise((resolve, reject) => {
    pool = mysql.createPool(poolConfig);

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("Conexión exitosa a MySQL");
      connection.release();
      isReady = true;
      resolve();
    });
  });
};

const initializeDatabase = async () => {
  try {
    console.log("Creando base de datos si no existe...");
    await createDatabaseIfNeeded();
    console.log("Base de datos lista");

    console.log("Inicializando pool de conexiones...");
    await initPool();

    console.log("Creando tabla si no existe...");
    await createTableIfNeeded();
    console.log("Tabla de pacientes lista");
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err.message);
    process.exit(1);
  }
};

const query = (...args) => {
  if (!isReady || !pool) {
    const err = new Error("Base de datos no está lista aún");
    if (args[args.length - 1] instanceof Function) {
      return args[args.length - 1](err);
    }
    throw err;
  }
  return pool.query(...args);
};

const execute = (...args) => {
  if (!isReady || !pool) {
    const err = new Error("Base de datos no está lista aún");
    if (args[args.length - 1] instanceof Function) {
      return args[args.length - 1](err);
    }
    throw err;
  }
  return pool.execute(...args);
};

const getConnection = (cb) => {
  if (!isReady || !pool) {
    cb(new Error("Base de datos no está lista aún"));
    return;
  }
  return pool.getConnection(cb);
};

const waitForReady = () => {
  return initializeDatabase();
};

const isDBReady = () => {
  return isReady;
};

module.exports = {
  query,
  execute,
  getConnection,
  waitForReady,
  isDBReady,
};
