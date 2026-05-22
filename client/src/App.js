import "./App.css";
import LandingPage from "./pages/OtraPage";
import PacientesPage from "./pages/PacientesPage";
import { useState } from "react";
import logo from "./logo192.png";

function App() {
  const [route, setRoute] = useState("landing"); // 'landing' | 'pacientes'

  function navigateTo(name) {
    setRoute(name);
    window.scrollTo(0, 0);
  }

  return (
    <div className="App">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img src={logo} alt="SaludYa" className="topbar-logo" />
            <span className="brand-title">SaludYa</span>
          </div>
          <nav className="page-nav" aria-label="Principal">
            <button
              className={`nav-button ${route === "landing" ? "active" : ""}`}
              onClick={() => navigateTo("landing")}
            >
              Inicio
            </button>
            <button
              className={`nav-button ${route === "pacientes" ? "active" : ""}`}
              onClick={() => navigateTo("pacientes")}
            >
              Pacientes
            </button>
          </nav>
        </div>
      </header>

      {route === "landing" && <LandingPage navigate={navigateTo} />}
      {route === "pacientes" && <PacientesPage navigate={navigateTo} />}
    </div>
  );
}

export default App;
