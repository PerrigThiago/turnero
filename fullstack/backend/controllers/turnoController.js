import * as Turno from "../models/turno.js";

export const crearTurno = async (req, res) => {
  try {
    const { detalle } = req.body;

    const nuevo = await Turno.createTurno(detalle);

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: error.message });
  }
};

export const listarTurnos = async (req, res) => {
  try {
    const turnos = await Turno.getTurnos();
    res.json(turnos);
  } catch (error) {
  console.error("ERROR REAL:", error);
  res.status(500).json({ error: error.message });
}
};