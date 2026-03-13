import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Turnos from "./components/turno";
import HistorialTurnos from "./components/HistorialTurnos";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Turnos />} />
        <Route path="/historial" element={<HistorialTurnos />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
