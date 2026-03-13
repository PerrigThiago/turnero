import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./turno.css";

const API_TURNOS = "http://localhost:3000/api/turnos";

function Historial() {
  const [turnos, setTurnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const obtenerTurnos = async () => {
    try {
      const res = await fetch(API_TURNOS);
      const data = await res.json();
      setTurnos(data);
    } catch (e) {
      console.error("Error al obtener historial:", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  const eliminarTurno = async (id) => {
    await fetch(`${API_TURNOS}/${id}`, { method: "DELETE" });
    obtenerTurnos();
  };

  const turnosFiltrados = turnos.filter((t) => {
    const texto = busqueda.toLowerCase();
    return (
      t.nombre?.toLowerCase().includes(texto) ||
      t.apellido?.toLowerCase().includes(texto) ||
      t.dni?.toLowerCase().includes(texto) ||
      t.detalle?.toLowerCase().includes(texto)
    );
  });

  // Agrupar por fecha
  const turnosPorFecha = turnosFiltrados.reduce((acc, t) => {
    const fecha = new Date(t.fecha_turno).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(t);
    return acc;
  }, {});

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Agenda</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">◈</span>
            <span>Turnos</span>
          </NavLink>
          <NavLink
            to="/historial"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">◷</span>
            <span>Historial</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div className="avatar-info">
            <span className="avatar-name">Admin</span>
            <span className="avatar-role">Administrador</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">Historial de Turnos</h1>
            <p className="page-subtitle">{turnos.length} turnos en total</p>
          </div>
          <div className="topbar-right">
            <div className="date-badge">
              {new Date().toLocaleDateString("es-AR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </header>

        {/* BUSCADOR */}
        <section className="form-card">
          <div className="field">
            <label className="field-label">Buscar turno</label>
            <input
              className="field-input"
              placeholder="Buscar por nombre, apellido, DNI o motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </section>

        {/* LISTA AGRUPADA POR FECHA */}
        {cargando ? (
          <div className="empty-state">
            <span className="empty-icon">◌</span>
            <span>Cargando historial...</span>
          </div>
        ) : turnosFiltrados.length === 0 ? (
          <div className="list-card">
            <div className="empty-state">
              <span className="empty-icon">◌</span>
              <span>
                {busqueda
                  ? "Sin resultados para la búsqueda"
                  : "No hay turnos registrados"}
              </span>
            </div>
          </div>
        ) : (
          Object.entries(turnosPorFecha)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([fecha, items]) => (
              <section key={fecha} className="list-card">
                <div className="card-header">
                  <span
                    className="card-title"
                    style={{ textTransform: "capitalize" }}
                  >
                    {fecha}
                  </span>
                  <span className="count-badge">
                    {items.length} turno{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="turnos-list">
                  {items
                    .sort(
                      (a, b) =>
                        new Date(a.fecha_turno) - new Date(b.fecha_turno),
                    )
                    .map((t) => {
                      const d = new Date(t.fecha_turno);
                      const horaStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                      return (
                        <div key={t.id} className="turno-row">
                          <div className="turno-hora">{horaStr}</div>
                          <div className="turno-info">
                            <span className="turno-usuario">
                              {t.nombre} {t.apellido}
                            </span>
                            {t.detalle && (
                              <span className="turno-servicio">
                                {t.detalle}
                              </span>
                            )}
                          </div>
                          {t.dni && (
                            <div className="turno-dir">DNI: {t.dni}</div>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => eliminarTurno(t.id)}
                            title="Eliminar turno"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                </div>
              </section>
            ))
        )}
      </main>
    </div>
  );
}

export default Historial;
