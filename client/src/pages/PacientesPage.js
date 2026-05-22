import { useEffect, useState } from "react";

export default function PacientesPage({ navigate }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [eps, setEps] = useState("");
  const [edad, setEdad] = useState(0);

  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

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

    // simple validation
    const nextErrors = {};
    if (!nombre.trim()) nextErrors.nombre = "El nombre es requerido";
    if (!identificacion.trim()) nextErrors.identificacion = "La cédula es requerida";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { nombre, correo, telefono, identificacion, especialidad, eps, edad };

    setLoading(true);
    setNotice(null);

    try {
      if (editIndex !== null) {
        const paciente = registros[editIndex];
        const res = await fetch(`http://localhost:3001/pacientes/${paciente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const nuevos = [...registros];
          nuevos[editIndex] = { ...nuevos[editIndex], ...data };
          setRegistros(nuevos);
          setNotice({ type: "success", text: "Paciente actualizado correctamente" });
        } else {
          setNotice({ type: "error", text: data.error || "Error al actualizar el paciente" });
        }
      } else {
        const res = await fetch("http://localhost:3001/pacientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setRegistros([...registros, data]);
          setNotice({ type: "success", text: "Paciente guardado correctamente" });
        } else {
          setNotice({ type: "error", text: data.error || "Error al guardar el paciente" });
        }
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error de conexión" });
    } finally {
      setLoading(false);
      limpiarFormulario();
      setEditIndex(null);
    }
  };

  const eliminarRegistro = async (idx) => {
    const docente = registros[idx];
    if (!window.confirm(`Eliminar paciente ${docente.nombre}?`)) return;
    try {
      const response = await fetch(`http://localhost:3001/pacientes/${docente.id}`, { method: "DELETE" });
      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        if (editIndex === idx) {
          setEditIndex(null);
          limpiarFormulario();
        }
        setNotice({ type: "success", text: "Paciente eliminado" });
      } else {
        setNotice({ type: "error", text: "Error al eliminar el paciente" });
      }
    } catch (error) {
      setNotice({ type: "error", text: "Error de conexión" });
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel">
          <div className="auth-header">
            <h1 className="auth-main-title">Pacientes</h1>
            <p className="auth-description">Agregar y administrar pacientes</p>
          </div>

          <form className="data-panel" onSubmit={registrarDatos}>
            <div className="data-form">
              <div>
                <label className="auth-label">Nombre completo</label>
                <input
                  className="auth-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. María Fernanda López"
                  aria-label="nombre"
                />
                {errors.nombre && <div className="form-error">{errors.nombre}</div>}
              </div>
              <div>
                <label className="auth-label">Correo electrónico</label>
                <input className="auth-input" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" aria-label="correo" />
              </div>

              <div>
                <label className="auth-label">Teléfono</label>
                <input className="auth-input" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+57 300 1234567" />
              </div>

              <div>
                <label className="auth-label">Cédula</label>
                <input className="auth-input" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} placeholder="10234567" aria-label="cedula" />
                {errors.identificacion && <div className="form-error">{errors.identificacion}</div>}
              </div>

              <div>
                <label className="auth-label">Especialidad</label>
                <input className="auth-input" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej. Dermatología" />
              </div>

              <div>
                <label className="auth-label">EPS</label>
                <input className="auth-input" value={eps} onChange={(e) => setEps(e.target.value)} placeholder="Ej. Sura" />
              </div>

              <div>
                <label className="auth-label">Edad</label>
                <input className="auth-input" type="number" value={edad} onChange={(e) => setEdad(Number(e.target.value))} placeholder="Ej. 25" />
              </div>

              <div className="full">
                <div className="data-actions">
                  <button className="auth-button" type="submit" disabled={loading}>{loading ? 'Guardando...' : editIndex !== null ? 'Actualizar' : 'Registrar'}</button>
                  <button className="welcome-button" type="button" onClick={() => { limpiarFormulario(); setEditIndex(null); setErrors({}); }}>Limpiar</button>
                  <button className="nav-button" type="button" onClick={() => navigate && navigate('landing')}>Volver</button>
                </div>
                {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
              </div>
            </div>
          </form>
        </div>

        <div className="auth-panel auth-panel--welcome">
          <div className="auth-header">
            <h2 className="auth-main-title">Pacientes registrados</h2>
            <p className="auth-description">Consulta, edita o elimina los pacientes activos en el sistema.</p>
          </div>
          <div className="data-table-wrapper tabla-container">
            {registros.length === 0 ? (
              <div className="data-empty">No hay pacientes. Registre uno usando el formulario.</div>
            ) : (
              <table className="data-table tabla-registros">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Cédula</th>
                    <th>EPS</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((reg, idx) => (
                    <tr key={reg.id ?? idx}>
                      <td>{reg.nombre}</td>
                      <td>{reg.correo}</td>
                      <td>{reg.telefono}</td>
                      <td>{reg.identificacion}</td>
                      <td>{reg.eps}</td>
                      <td>{reg.edad}</td>
                      <td className="table-actions-cell">
                        <button className="btn-editar" onClick={() => editarRegistro(idx)}>Editar</button>
                        <button className="btn-eliminar" onClick={() => eliminarRegistro(idx)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
