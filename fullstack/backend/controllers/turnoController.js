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
    const { detalle, fecha_turno } = req.body;

    // Validaciones básicas de presencia
    if (!detalle || !fecha_turno) {
      return res
        .status(400)
        .json({ error: "Detalle y fecha del turno son obligatorios" });
    }

    // Validar tipos: detalle debe ser string no numérica pura
    if (typeof detalle !== "string" || detalle.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "El detalle debe ser un texto válido" });
    }
    if (/^\d+$/.test(detalle.trim())) {
      return res
        .status(400)
        .json({ error: "El detalle no puede ser solo números" });
    }

    // Validar fecha
    const fecha = new Date(fecha_turno);
    if (Number.isNaN(fecha.getTime())) {
      return res
        .status(400)
        .json({ error: "La fecha del turno no es válida" });
    }

    // Normalizar a precisión de minutos para evitar duplicados por milisegundos
    fecha.setSeconds(0, 0);
    const fechaIso = fecha.toISOString();

    // No permitir más de 1 turno mismo día y mismo horario
    const existente = await Turno.getTurnoByFecha(fechaIso);
    if (existente) {
      return res
        .status(409)
        .json({ error: "Ya existe un turno para ese día y horario" });
    }

    const nuevoTurno = await Turno.createTurno(detalle, fechaIso);

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Turno.deleteTurno(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};