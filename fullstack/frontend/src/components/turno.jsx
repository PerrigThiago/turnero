import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./turno.css";

const API_TURNOS = "http://localhost:3000/api/turnos";
const API_USUARIOS = "http://localhost:3000/api/usuarios";

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [detalle, setDetalle] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState(null);

  const horarios = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const obtenerTurnos = async () => {
    try {
      const res = await fetch(API_TURNOS);
      const data = await res.json();
      setTurnos(data);
    } catch (e) {
      console.error("Error al obtener turnos:", e);
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setTelefono("");
    setDetalle("");
    setHoraSeleccionada(null);
  };

  const handleSubmit = async () => {
    setError(null);

    // Validar campos obligatorios en frontend
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !dni.trim() ||
      !telefono.trim() ||
      !detalle.trim() ||
      !horaSeleccionada
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validar que dni y teléfono sean numéricos
    if (!/^\d+$/.test(dni.trim())) {
      setError("El DNI debe contener solo números.");
      return;
    }

    if (!/^\d+$/.test(telefono.trim())) {
      setError("El teléfono debe contener solo números.");
      return;
    }

    // Validar que los campos de texto no sean solo números
    const soloNumeros = (v) => /^\d+$/.test(v.trim());
    if (soloNumeros(nombre) || soloNumeros(apellido) || soloNumeros(detalle)) {
      setError("Nombre, apellido y detalle deben ser texto, no solo números.");
      return;
    }

    try {
      const fechaConHora = new Date(fechaSeleccionada);
      const [hh, mm] = horaSeleccionada.split(":");
      fechaConHora.setHours(parseInt(hh), parseInt(mm), 0, 0);

      const resTurno = await fetch(API_TURNOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detalle,
          fecha_turno: fechaConHora.toISOString(),
        }),
      });
      if (!resTurno.ok) {
        const errData = await resTurno.json().catch(() => ({}));
        throw new Error(errData.error || "Error al crear el turno");
      }
      const turnoCreado = await resTurno.json();

      const resUsuario = await fetch(API_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          dni,
          telefono,
          id_turno: turnoCreado.id,
        }),
      });
      if (!resUsuario.ok) throw new Error("Error al crear el usuario");

      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
      resetForm();
      obtenerTurnos();
    } catch (e) {
      setError(e.message);
    }
  };

  const eliminarTurno = async (id) => {
    await fetch(`${API_TURNOS}/${id}`, { method: "DELETE" });
    obtenerTurnos();
  };

  const turnosDelDia = turnos.filter(
    (t) =>
      new Date(t.fecha_turno).toDateString() ===
      fechaSeleccionada.toDateString(),
  );

  const horasOcupadas = turnosDelDia.map((t) => {
    const d = new Date(t.fecha_turno);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  const fechaFormateada = fechaSeleccionada.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            <h1 className="page-title">Agenda de Turnos</h1>
            <p className="page-subtitle">Gestioná tus citas fácilmente</p>
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

        <section className="form-card">
          <div className="form-card-header">
            <span className="form-card-title">Datos del turno</span>
            <span className="form-card-pill">Nuevo turno</span>
          </div>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Nombre *</label>
              <input
                className="field-input"
                type="text"
                placeholder="Nombre del cliente"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Apellido</label>
              <input
                className="field-input"
                type="text"
                placeholder="Apellido del cliente"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">DNI</label>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                placeholder="Número de DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Teléfono</label>
              <input
                className="field-input"
                type="tel"
                inputMode="numeric"
                placeholder="Teléfono de contacto"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="field-label">Motivo / Detalle</label>
              <input
                className="field-input"
                type="text"
                placeholder="Motivo de la consulta"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
        </section>

        <div className="booking-grid">
          <section className="cal-card">
            <div className="card-header">
              <span className="card-title">Seleccioná una fecha</span>
            </div>
            <Calendar
              onChange={setFechaSeleccionada}
              value={fechaSeleccionada}
              locale="es-AR"
            />
          </section>

          <section className="hours-card">
            <div className="card-header">
              <span className="card-title">Horarios disponibles</span>
              <span className="selected-date-badge">{fechaFormateada}</span>
            </div>
            <div className="hours-grid">
              {horarios.map((hora) => {
                const ocupado = horasOcupadas.includes(hora);
                const seleccionado = horaSeleccionada === hora;
                return (
                  <button
                    key={hora}
                    className={`hour-btn ${ocupado ? "ocupado" : ""} ${seleccionado ? "seleccionado" : ""}`}
                    disabled={ocupado}
                    onClick={() => setHoraSeleccionada(hora)}
                  >
                    <span className="hour-text">{hora}</span>
                    {ocupado && <span className="hour-tag"></span>}
                    {seleccionado && !ocupado && (
                      <span className="hour-tag"></span>
                    )}
                  </button>
                );
              })}
            </div>
            {horaSeleccionada && (
              <div className="selection-summary">
                <span>📅 {fechaFormateada}</span>
                <span>🕐 {horaSeleccionada}</span>
              </div>
            )}
            <button
              className={`save-btn ${guardado ? "guardado" : ""}`}
              onClick={handleSubmit}
              disabled={
                !horaSeleccionada ||
                !nombre.trim() ||
                !apellido.trim() ||
                !dni.trim() ||
                !telefono.trim() ||
                !detalle.trim()
              }
            >
              {guardado ? "✓ Turno guardado" : "Guardar turno"}
            </button>
          </section>
        </div>

        <section className="list-card">
          <div className="card-header">
            <span className="card-title">Turnos del día</span>
            <span className="count-badge">{turnosDelDia.length} turnos</span>
          </div>
          {turnosDelDia.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◌</span>
              <span>No hay turnos para este día</span>
            </div>
          ) : (
            <div className="turnos-list">
              {turnosDelDia
                .sort(
                  (a, b) => new Date(a.fecha_turno) - new Date(b.fecha_turno),
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
                          <span className="turno-servicio">{t.detalle}</span>
                        )}
                      </div>
                      {t.dni && <div className="turno-dir">DNI: {t.dni}</div>}
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
          )}
        </section>
      </main>
    </div>
  );
}

export default Turnos;
