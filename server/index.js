// servidor API

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================
   RUTA 1 - OBTENER TODOS LOS PACIENTES
========================================= */

app.get("/pacientes", (req, res) => {
  const sql = "SELECT * FROM pacientes";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener pacientes",
      });
    }

    res.json(results);
  });
});

/* =========================================
   RUTA 2 - OBTENER PACIENTE POR ID
========================================= */

app.get("/pacientes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pacientes WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener paciente",
      });
    }

    if (!results.length) {
      return res.status(404).json({
        error: "Paciente no encontrado",
      });
    }

    res.json(results[0]);
  });
});

/* =========================================
   RUTA 3 - REGISTRAR PACIENTE
========================================= */

app.post("/pacientes", (req, res) => {
  const { nombre, correo, telefono, identificacion, especialidad, eps, edad } =
    req.body;

  if (
    !nombre?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !identificacion?.trim()
  ) {
    return res.status(400).json({
      error: "Todos los campos obligatorios deben completarse",
    });
  }

  const sql = `
    INSERT INTO pacientes
    (nombre, correo, telefono, identificacion, especialidad, eps, edad)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nombre.trim(),
      correo.trim(),
      telefono.trim(),
      identificacion.trim(),
      especialidad?.trim() || "",
      eps?.trim() || "",
      edad || 0,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al guardar paciente",
        });
      }

      res.json({
        id: result.insertId,
        nombre,
        correo,
        telefono,
        identificacion,
        especialidad,
        eps,
        edad,
      });
    },
  );
});

/* =========================================
   RUTA 4 - ACTUALIZAR PACIENTE
========================================= */

app.put("/pacientes/:id", (req, res) => {
  const { id } = req.params;

  const { nombre, correo, telefono, identificacion, especialidad, eps, edad } =
    req.body;

  const sql = `
    UPDATE pacientes
    SET
      nombre = ?,
      correo = ?,
      telefono = ?,
      identificacion = ?,
      especialidad = ?,
      eps = ?,
      edad = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nombre, correo, telefono, identificacion, especialidad, eps, edad, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al actualizar paciente",
        });
      }

      res.json({
        message: "Paciente actualizado correctamente",
      });
    },
  );
});

/* =========================================
   RUTA 5 - ELIMINAR PACIENTE
========================================= */

app.delete("/pacientes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pacientes WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        error: "Error al eliminar paciente",
      });
    }

    res.json({
      message: "Paciente eliminado correctamente",
    });
  });
});

/* =========================================
   SERVIDOR
========================================= */

app.listen(3001, () => {
  console.log("Servidor backend corriendo en puerto 3001");
});
