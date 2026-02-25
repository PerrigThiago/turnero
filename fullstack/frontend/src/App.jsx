import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/turnos";

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [detalle, setDetalle] = useState("");
  const [editandoId, setEditandoId] = useState(null);

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

    if (editandoId) {
      await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detalle }),
      });
      setEditandoId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detalle }),
      });
    }

    setDetalle("");
    obtenerTurnos();
  };

  const eliminarTurno = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    obtenerTurnos();
  };
  
  const editarTurno = (turno) => {
    setDetalle(turno.detalle);
    setEditandoId(turno.id);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Gestión de Turnos</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Detalle del turno"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
        />
        <button type="submit">
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <hr />

      <ul>
        {turnos.map((turno) => (
          <li key={turno.id}>
            <strong>{turno.detalle}</strong> -{" "}
            {new Date(turno.fecha_registro).toLocaleString()}
            <button onClick={() => editarTurno(turno)}>
              Editar
            </button>
            <button onClick={() => eliminarTurno(turno.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Turnos;