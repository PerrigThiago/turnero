import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const API_URL = "http://localhost:3000/api/turnos";

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [detalle, setDetalle] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const obtenerTurnos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTurnos(data);
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!detalle.trim()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        detalle,
        fecha_turno: fechaSeleccionada,
      }),
    });

    setDetalle("");
    obtenerTurnos();
  };

  const eliminarTurno = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    obtenerTurnos();
  };

  // 🔹 Filtrar turnos del día seleccionado
  const turnosDelDia = turnos.filter((turno) => {
    const fechaTurno = new Date(turno.fecha_turno);
    return (
      fechaTurno.toDateString() ===
      fechaSeleccionada.toDateString()
    );
  });

  // 🔹 Marcar días ocupados
  const diasOcupados = turnos.map((t) =>
    new Date(t.fecha_turno).toDateString()
  );

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>📅 Agenda de Turnos</h2>

      <div style={{ display: "flex", gap: "40px" }}>
        <Calendar
          onChange={setFechaSeleccionada}
          value={fechaSeleccionada}
          tileClassName={({ date }) =>
            diasOcupados.includes(date.toDateString())
              ? "ocupado"
              : null
          }
        />

        <div>
          <h3>
            Turnos del {fechaSeleccionada.toLocaleDateString()}
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Detalle del turno"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
            <button type="submit">Agregar</button>
          </form>

          <hr />

          {turnosDelDia.length === 0 ? (
            <p>No hay turnos este día</p>
          ) : (
            turnosDelDia.map((turno) => (
              <div key={turno.id}>
                <strong>{turno.detalle}</strong>
                <button
                  onClick={() => eliminarTurno(turno.id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Turnos;