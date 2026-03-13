import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Turnos from "./components/turno";
import Historial from "./components/Historial";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Turnos />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
