import logo from "../assets/logoSaludYa.png";
export default function LandingPage({ navigate }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel auth-panel--form">
          <div className="auth-header centered">
            
            <h1 className="auth-main-title">INICIAR SESIÓN</h1>
            <p className="auth-description">
            </p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="auth-label" htmlFor="user-input">
              </label>
              <input
                id="user-input"
                type="text"
                className="auth-input"
                placeholder="Ingresar usuario"
                aria-label="usuario"
              />
            </div>

            <div>
              <label className="auth-label" htmlFor="password-input">
                Contraseña
              </label>
              <input
                id="password-input"
                type="password"
                className="auth-input"
                placeholder="Ingresar contraseña"
                aria-label="contraseña"
              />
            </div>

            <div className="auth-options centered">
              <label>
                <input type="radio" name="role" value="afiliado" /> Afiliado
              </label>
              <label>
                <input type="radio" name="role" value="profesional" /> Profesional
              </label>
            </div>

            <div className="auth-actions centered">
              <button
                type="button"
                className="auth-link"
                onClick={() => alert("Función de recuperación no implementada")}
              >
                Recordar contraseña
              </button>
              <button
                type="submit"
                className="auth-button"
                onClick={() => navigate && navigate("pacientes")}
              >
                INICIAR SESIÓN
              </button>
            </div>
          </form>
        </div>

        <div className="auth-panel auth-panel--welcome">
          <img src={logo} alt="SaludYa logo" className="welcome-logo" />
          <h2>Bienvenido a SaludYa</h2>
          <p className="welcome-text">
            Crea tu cuenta para acceder a funciones avanzadas y mantener toda la información de pacientes en un solo lugar.
          </p>
          <button
            type="button"
            className="welcome-button"
            onClick={() => navigate && navigate("pacientes")}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
