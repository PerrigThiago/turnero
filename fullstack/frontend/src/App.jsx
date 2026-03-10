import { useEffect, useState } from 'react'
import './App.css'

/*
  useState crea un estado dentro del componente
  turnos: valor actual
  setTurnos: función para actualizarlo

  turnos.map(...) recorre el array y pinta un <li> por cada turno
  key={t.id} ayuda a React a identificar cada elemento de la lista
*/
function App() {
  const [turnos, setTurnos] = useState([
    { id: 1, nombre: "Emanuel", numero: 1 },
    { id: 2, nombre: "Thiago", numero:2 },
  ]);

  useEffect(() => {
    fetch("http://localhost:3000/api/turnos")
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .catch((err) => {
        console.error("Error al cargar turnos", err);
      });
    }, 
  []);

return (
  <div>
    <h1>Turnero</h1>
    <ul>
      {turnos.map((t) => (
        <li key={t.id}>
          #{t.numero} - {t.nombre}
        </li>
      ))}
    </ul>
  </div>
  );
}

export default App;