import * as Turno from "../models/turno.js";

export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { detalle } = req.body;

    const turnoActualizado = await Turno.updateTurno(id, detalle);
    res.json(turnoActualizado);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al actualizar turno" });
  }
};
export const listarTurnos = async (req, res) => {
  try {
    const turnos = await Turno.getTurnos();
    res.json(turnos);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

export const obtenerTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.getTurnoById(id);

    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.json(turno);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener turno" });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { detalle } = req.body;

    if (!detalle) {
      return res.status(400).json({ error: "El detalle es obligatorio" });
    }

    const nuevoTurno = await Turno.createTurno(detalle);
    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    await Turno.deleteTurno(id);
    res.json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};