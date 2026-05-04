//servidor API

///get obtener - post crear - put actualizar - delete eliminar

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());

app.use(express.json());

//RUTA 1 OBTENER LA LISTA DE DOCENTES
app.get("/docentes", (req, res) => {
  const sql = "SELECT * FROM docentes";
  db.query(sql, (err, results) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al obtener los docentes" });
    }
    res.json(results);
  });
});

//RUTA 2 OBTENER UN DOCENTE POR ID
app.get("/docentes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM docentes WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al obtener al docente" });
    }
    res.json(results);

    if (!results.length) {
      //404 no encontrado
      return res.status(404).json({ error: "docente no encontrado" });
    }
    res.json(results[0]);
  });
});

//RUTA 3 GUARDAR UN DOCENTE

app.post("/docentes", (req, res) => {
  const {
    nombre,
    correo,
    telefono,
    titulo,
    area_academica,
    dedicacion,
    anios_experiencia,
  } = req.body;
  if (
    !nombre?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !titulo?.trim() ||
    !area_academica?.trim() ||
    !dedicacion?.trim()
  ) {
    return res.status(400).json({ error: "todos los campos son requeridos" });
  }
  const anios = Number(anios_experiencia);

  if (Number.isNaN(anios) || anios < 0) {
    return res
      .status(400)
      .json({ error: "anios de experiencia del docente invalidos" });
  }
  const sql =
    "INSERT INTO docentes(nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia) VALUES (?,?,?,?,?,?,?)";

  db.query(
    sql,
    [
      nombre.trim(),
      correo.trim(),
      telefono.trim(),
      titulo.trim(),
      area_academica.trim(),
      dedicacion.trim(),
      anios,
    ],
    (err, result) => {
      if (err) {
        //500 error interno de servidor, fallo la bd
        return res.status(500).json({ error: "error al guardar al docente" });
      }
      res.json({
        id: result.insertId,
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        titulo: titulo.trim(),
        area_academica: area_academica.trim(),
        decicacion: dedicacion.trim(),
        anios_experiencia: anios,
      });
    },
  );
});

//RUTA 4 ACTUALIZAR UN DOCENTE
app.put("/docentes/:id", (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    correo,
    telefono,
    titulo,
    area_academica,
    dedicacion,
    anios_experiencia,
  } = req.body;

  if (
    !nombre?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !titulo?.trim() ||
    !area_academica?.trim() ||
    !dedicacion?.trim()
  ) {
    return res.status(400).json({ error: "todos los campos son requeridos" });
  }

  const anios = Number(anios_experiencia);

  if (Number.isNaN(anios) || anios < 0) {
    return res
      .status(400)
      .json({ error: "anios de experiencia del docente invalidos" });
  }

  const sql =
    "UPDATE docentes SET  nombre=?, correo=?, telefono=?, titulo=?, area_academica=?, dedicacion=?, anios_experiencia=? WHERE id = ?";

  db.query(
    sql,
    [
      nombre.trim(),
      correo.trim(),
      telefono.trim(),
      titulo.trim(),
      area_academica.trim(),
      dedicacion.trim(),
      anios,
      id,
    ],
    (err) => {
      if (err) {
        //500 error interno de servidor, fallo la bd
        return res
          .status(500)
          .json({ error: "error al actualizar al docente" });
      }
      res.json({ message: "docente actualizado correctamente" });
    },
  );
});

//RUTA 5 ELIMINAR DOCENTE
app.delete("/docentes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM docentes WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al eliminar al docente" });
    }
    res.json({ message: "docente eliminado correctamente" });
  });
});

app.listen(3001, () => {
  console.log("servidor backend corriendo desde el puerto 3001");
});
