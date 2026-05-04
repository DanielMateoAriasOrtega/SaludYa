//servidor API

///get obtener - post crear - put actualizar - delete eliminar

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());

app.use(express.json());

//RUTA 1 OBTENER LA LISTA DE PACIENTES
app.get("/pacientes", (req, res) => {
  const sql = "SELECT * FROM pacientes";
  db.query(sql, (err, results) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al obtener los pacientes" });
    }
    res.json(results);
  });
});

//RUTA 2 OBTENER UN PACIENTE POR ID
app.get("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM pacientes WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al obtener al paciente" });
    }
    res.json(results);

    if (!results.length) {
      //404 no encontrado
      return res.status(404).json({ error: "paciente no encontrado" });
    }
    res.json(results[0]);
  });
});

//RUTA 3 GUARDAR UN PACIENNTE

app.post("/PACIENTES", (req, res) => {
  const {
    nombre,
    correo,
    telefono,
    titulo,
    especialidad_medicarequerida,
    identificacion,
    antecedentes_medicos,
  } = req.body;
  if (
    !nombre?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !titulo?.trim() ||
    !dimetu_edad?.trim() ||
    !identificacion?.trim()
  ) {
    return res.status(400).json({ error: "todos los campos son requeridos" });
  }
  const anios = Number(dimetu_edad);

  if (Number.isNaN(anios) || anios < 0) {
    return res
      .status(400)
      .json({ error: "edad invalida" });
  }
  const sql =
    "INSERT INTO pacientes(nombre, correo, telefono, titulo, dimetu_edad, identificacion, dimetu_edad) VALUES (?,?,?,?,?,?,?)";

  db.query(
    sql,
    [
      nombre.trim(),
      correo.trim(),
      telefono.trim(),
      titulo.trim(),
      dimetu_edad.trim(),
      identificacion.trim(),
      anios,
    ],
    (err, result) => {
      if (err) {
        //500 error interno de servidor, fallo la bd
        return res.status(500).json({ error: "error al guardar al paciente" });
      }
      res.json({
        id: result.insertId,
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        titulo: titulo.trim(),
        dimetu_edad: dimetu_edad.trim(),
        identificacion: identificacion.trim(),
        anios_experiencia: anios,
      });
    },
  );
});

//RUTA 4 ACTUALIZAR UN PACIENTE
app.put("/PACIENTE/:id", (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    correo,
    telefono,
    titulo,
    especialidad_medicarequerida,
    identificacion,
    dimetu_edad,
  } = req.body;

  if (
    !nombre?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !titulo?.trim() ||
    !especialidad_medicarequerida?.trim() ||
    !identificacion?.trim()
  ) {
    return res.status(400).json({ error: "todos los campos son requeridos" });
  }

  const anios = Number(dimetu_edad);

  if (Number.isNaN(anios) || anios < 0) {
    return res
      .status(400)
      .json({ error: "anios de experiencia del paciente invalidos" });
  }

  const sql =
    "UPDATE docentes SET  nombre=?, correo=?, telefono=?, titulo=?, especialidad_medicarequerida=?, identificacion=?, anios_experiencia=? WHERE id = ?";

  db.query(
    sql,
    [
      nombre.trim(),
      correo.trim(),
      telefono.trim(),
      titulo.trim(),
      especialidad_medicarequerida.trim(),
      identificacion.trim(),
      anios,
      id,
    ],
    (err) => {
      if (err) {
        //500 error interno de servidor, fallo la bd
        return res
          .status(500)
          .json({ error: "error al actualizar al paciente" });
      }
      res.json({ message: "paciente actualizado correctamente" });
    },
  );
});

//RUTA 5 ELIMINAR PACIENTE
app.delete("/paciente/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pacientes WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      //500 error interno de servidor, fallo la bd
      return res.status(500).json({ error: "error al eliminar al paciente" });
    }
    res.json({ message: "paciente eliminado correctamente" });
  });
});

const startServer = async () => {
  try {
    await db.waitForReady();
    app.listen(3001, () => {
      console.log("servidor backend corriendo desde el puerto 3001");
    });
  } catch (err) {
    console.error("No se puede iniciar el servidor:", err.message);
    process.exit(1);
  }
};

startServer();
