import { useState, useEffect } from "react";

function App() {
  const [turnos, setTurnos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");

  // Obtener turnos
  const obtenerTurnos = async () => {
    const res = await fetch("http://localhost:3000/api/turnos");
    const data = await res.json();
    setTurnos(data);
  };

  // Crear turno
  const crearTurno = async () => {
    if (!nombre || !fecha) return;

    await fetch("http://localhost:3000/api/turnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, fecha }),
    });

    setNombre("");
    setFecha("");
    obtenerTurnos();
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Turnero</h1>

      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button onClick={crearTurno}>
          Crear
        </button>
      </div>

      <hr />

      <h2>Turnos</h2>

      {turnos.map((turno) => (
        <div key={turno.id}>
          <strong>{turno.nombre}</strong> -{" "}
          {new Date(turno.fecha).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}

export default App;