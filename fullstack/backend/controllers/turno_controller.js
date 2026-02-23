import * as Turno from "../models/turno.js";

export const listarTurnos = async (req, res) => {
  try {
    const turnos = await Turno.getTurnos();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { nombre, fecha } = req.body;
    const nuevoTurno = await Turno.createTurno(nombre, fecha);
    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(500).json({ error: "Error al crear turno" });
  }
};