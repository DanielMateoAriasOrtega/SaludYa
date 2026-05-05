import { useEffect, useState } from "react";
import "./App.css";
//no usar ctr + x
// porfa

function App() {
  //memoria del formulario
  //crear los estados
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [eps, setEps] = useState("");
  const [edad, setEdad] = useState(0);

  const [registros, setRegistros] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch("http://localhost:3001/pacientes");
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert("Error al cargar los docentes");
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setIdentificacion("");
    setEspecialidad("");
    setEps("");
    setEdad(0);
  };

  const registrarDatos = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      identificacion,
      especialidad,
      eps,
      edad,
    };

    if (editIndex !== null) {
      //camino de ACTUALIZAR
      try {
        const docente = registros[editIndex];
        const response = await fetch(
          `http://localhost:3001/pacientes/${docente.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editIndex] = {
            ...docente,
            nombre,
            correo,
            telefono,
            identificacion,
            especialidad,
            eps,
            edad,
          };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert("Docente actualizado correctamente");
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || "Error al actualizar el docente");
        }
      } catch (error) {
        alert("Error de conexion al actualizar un docente");
      }
    } else {
      try {
        //camino de GUARDAR
        const response = await fetch("http://localhost:3001/pacientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          setRegistros([...registros, data]);
          alert("Docente guardado correctamente");
        } else {
          alert(data.error || "Error al guardar el docente");
        }
      } catch (error) {
        alert("Error de conexion al guardar");
      }
    }
    limpiarFormulario();
  };

  const eliminarRegistro = async (idx) => {
    const docente = registros[idx];

    try {
      const response = await fetch(
        `http://localhost:3001/pacientes/${docente.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        if (editIndex === idx) {
          setEditIndex(null);
          limpiarFormulario();
        }
        alert("Docente eliminado");
      } else {
        alert("Error al eliminar el docente");
      }
    } catch (error) {
      alert("Error de conexion");
    }
  };

  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setTelefono(reg.telefono);
    setIdentificacion(reg.identificacion);
    setEspecialidad(reg.especialidad);
    setEps(reg.eps);
    setEdad(reg.edad);
    setEditIndex(idx);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Gestión de pacientes SaludYa</h1>
        <p className="app-subtitle">
          Registro de pacientes: datos medicos y de contacto
        </p>
      </header>

      <div className="datos">
        {/*
          Todos los <input> siguen la misma idea:
          value = qué hay guardado en useState | onChange = cuando el usuario escribe, actualizamos ese estado
          e.target.value = el texto que acaba de escribir en ESA casilla
        */}
        <label>
          Nombre completo:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María Fernanda López"
          />
        </label>
        <label>
          Correo electrónico:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="nombre@universidad.edu"
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. +57 300 1234567"
          />
        </label>
        <label>
          Cedula Iden:tificacion:
          <input
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            placeholder="Ej. Doctorado, Maestría, Especialización"
          />
        </label>
        <label>
          Especialidad:
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej. Ingeniería de Software, Matemáticas"
          />
        </label>
        <label>
          EPS:
          <input
            type="text"
            value={eps}
            onChange={(e) => setEps(e.target.value)}
            placeholder="Ej. Sura, Sanitas, Nueva EPS"
          />
        </label>
        <label>
          Edad:
          <input
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
            type="number"
            min={0}
          />
        </label>

        <button type="button" onClick={registrarDatos}>
          {editIndex !== null ? "Actualizar" : "Registrar"}
        </button>
      </div>

      {registros.length > 0 && (
        <div className="tabla-container">
          <table className="tabla-registros">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Identificación</th>
                <th>Especialidad</th>
                <th>EPS</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, idx) => (
                <tr key={reg.id ?? idx}>
                  <td>{reg.nombre}</td>
                  <td>{reg.correo}</td>
                  <td>{reg.telefono}</td>
                  <td>{reg.identificacion}</td>
                  <td>{reg.especialidad}</td>
                  <td>{reg.eps}</td>
                  <td>{reg.edad}</td>
                  <td>
                    <button
                      className="btn-editar"
                      type="button"
                      onClick={() => editarRegistro(idx)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      type="button"
                      onClick={() => eliminarRegistro(idx)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Permite que index.js importe este componente: import App from './App'
export default App;
