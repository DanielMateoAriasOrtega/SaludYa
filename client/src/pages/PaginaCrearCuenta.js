import { useState } from "react";
import logo from "../assets/Logo.png";

export default function PaginaCrearCuenta({ navigate }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    role: "afiliado",
  });
  const [notice, setNotice] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nombre || !form.correo || !form.contraseña) {
      setNotice({ type: "error", text: "Por favor completa todos los campos." });
      return;
    }

    setNotice({
      type: "success",
      text: "Cuenta creada con éxito. Ahora puedes iniciar sesión.",
    });

    setForm({ nombre: "", correo: "", contraseña: "", role: "afiliado" });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel auth-panel--form">
          <div className="auth-header centered">
            <h1 className="auth-main-title">Crear cuenta</h1>
            <p className="auth-description">Completa los datos para crear tu cuenta en SaludYa.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <input
                name="nombre"
                type="text"
                className="auth-input"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                aria-label="nombre completo"
              />
            </div>

            <div>
              <input
                name="correo"
                type="email"
                className="auth-input"
                placeholder="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                aria-label="correo"
              />
            </div>

            <div>
              <input
                name="contraseña"
                type="password"
                className="auth-input"
                placeholder="Contraseña"
                value={form.contraseña}
                onChange={handleChange}
                aria-label="contraseña"
              />
            </div>

            <div className="auth-options centered">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="afiliado"
                  checked={form.role === "afiliado"}
                  onChange={handleChange}
                />
                Afiliado
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="profesional"
                  checked={form.role === "profesional"}
                  onChange={handleChange}
                />
                Profesional
              </label>
            </div>

            <div className="auth-actions centered">
              <button type="button" className="auth-link" onClick={() => navigate && navigate("landing")}>Volver</button>
              <button type="submit" className="auth-button">Crear cuenta</button>
            </div>

            {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
          </form>
        </div>

        <div className="auth-panel auth-panel--welcome">
          <img src={logo} alt="SaludYa logo" className="welcome-logo" />
          <h2 className="welcome-title">¡Ya casi estás listo!</h2>
          <p className="welcome-text">Regístrate y accede a todas las funciones de SaludYa.</p>
        </div>
      </div>
    </div>
  );
}
