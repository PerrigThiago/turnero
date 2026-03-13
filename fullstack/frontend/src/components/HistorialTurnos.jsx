import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./turno.css";
import "./historial.css";

const API_TURNOS = "http://localhost:3000/api/turnos";

function HistorialTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenDir, setOrdenDir] = useState("desc");

  useEffect(() => {
    fetch(API_TURNOS)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener historial");
        return res.json();
      })
      .then((data) => setTurnos(Array.isArray(data) ? data : []))
      .catch((err) => setError("No se pudo cargar el historial"))
      .finally(() => setCargando(false));
  }, []);

  const turnosUnicos = Array.from(new Map(turnos.map((t) => [t.id, t])).values());

  const turnosFiltrados = turnosUnicos
    .filter((t) => {
      const q = busqueda.toLowerCase();
      return (
        t.nombre?.toLowerCase().includes(q) ||
        t.apellido?.toLowerCase().includes(q) ||
        t.dni?.toLowerCase().includes(q) ||
        t.detalle?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.fecha_turno);
      const db = new Date(b.fecha_turno);
      return ordenDir === "desc" ? db - da : da - db;
    });

  const formatFecha = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-AR", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatHora = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const totalTurnos = turnosUnicos.length;
  const hoy = new Date().toDateString();
  const turnosHoy = turnosUnicos.filter((t) => new Date(t.fecha_turno).toDateString() === hoy).length;
  const estesMes = turnosUnicos.filter((t) => {
    const d = new Date(t.fecha_turno);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este turno?")) return;
    try {
      const res = await fetch(`${API_TURNOS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTurnos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Ocurrió un error al eliminar el turno.");
    }
  };

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Agenda</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon">◈</span>
            <span>Turnos</span>
          </NavLink>
          <NavLink to="/historial" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
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
            <p className="page-subtitle">Registro completo de citas y consultas</p>
          </div>
          <div className="topbar-right">
            <div className="date-badge">
              {new Date().toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}
            </div>
          </div>
        </header>

        <div className="historial-stats">
          <div className="stat-card">
            <span className="stat-value">{totalTurnos}</span>
            <span className="stat-label">Total de turnos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{turnosHoy}</span>
            <span className="stat-label">Hoy</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{estesMes}</span>
            <span className="stat-label">Este mes</span>
          </div>
          <div className="stat-card stat-card--accent">
            <span className="stat-value">{turnosFiltrados.length}</span>
            <span className="stat-label">Resultados</span>
          </div>
        </div>

        <section className="form-card">
          <div className="form-card-header">
            <span className="form-card-title">Filtros</span>
            <span className="form-card-pill">{turnosFiltrados.length} registro{turnosFiltrados.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="historial-filters">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Buscar</label>
              <input
                className="field-input"
                placeholder="Nombre, apellido, DNI o motivo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Orden</label>
              <select className="field-input" value={ordenDir} onChange={(e) => setOrdenDir(e.target.value)}>
                <option value="desc">Más reciente primero</option>
                <option value="asc">Más antiguo primero</option>
              </select>
            </div>
          </div>
        </section>

        <section className="list-card">
          <div className="card-header">
            <span className="card-title">Registro de turnos</span>
            <span className="count-badge">{turnosFiltrados.length} turnos</span>
          </div>

          {cargando ? (
            <div className="empty-state"><span className="empty-icon">◌</span><span>Cargando historial...</span></div>
          ) : error ? (
            <div className="empty-state"><span className="empty-icon">⚠</span><span style={{ color: "#ef4444" }}>{error}</span></div>
          ) : turnosFiltrados.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">◌</span><span>{busqueda ? "Sin resultados" : "No hay turnos en el historial"}</span></div>
          ) : (
            <div className="historial-table-wrapper">
              <table className="historial-table">
                <thead>
                  <tr className="historial-table-header">
                    <th className="historial-col-label">Fecha</th>
                    <th className="historial-col-label">Hora</th>
                    <th className="historial-col-label">Nombre</th>
                    <th className="historial-col-label">Apellido</th>
                    <th className="historial-col-label">DNI</th>
                    <th className="historial-col-label">Teléfono</th>
                    <th className="historial-col-label">Motivo</th>
                    <th className="historial-col-label" style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosFiltrados.map((t) => (
                    <tr key={t.id} className="historial-row">
                      <td className="historial-fecha">{formatFecha(t.fecha_turno)}</td>
                      <td className="turno-hora">{formatHora(t.fecha_turno)}</td>
                      <td className="historial-cell">{t.nombre || "—"}</td>
                      <td className="historial-cell">{t.apellido || "—"}</td>
                      <td className="historial-cell historial-cell--muted">{t.dni || "—"}</td>
                      <td className="historial-cell historial-cell--muted">{t.telefono || "—"}</td>
                      <td className="historial-cell historial-cell--motivo">{t.detalle || "—"}</td>
                      <td style={{ textAlign: "right" }}>
                        <button className="delete-btn" onClick={() => handleEliminar(t.id)} title="Eliminar">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HistorialTurnos;