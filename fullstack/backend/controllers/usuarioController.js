import * as Usuario from "../models/usuario.js"; // ← estaba importando como "Turno"

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getUsuario();
    res.json(usuarios);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.getUsuarioById(id);
    res.json(usuario);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, id_turno } = req.body; // ← desestructurado en una línea + id_turno

    // Validar presencia de todos los campos
    if (
      !nombre ||
      !apellido ||
      !dni &&
      dni !== 0 &&
      dni !== "0" ||
      !telefono &&
      telefono !== 0 &&
      telefono !== "0" ||
      !id_turno
    ) {
      return res
        .status(400)
        .json({ error: "Nombre, apellido, DNI, teléfono e id_turno son obligatorios" });
    }

    // Validar tipos de strings: no permitir numéricos puros
    const soloNumeros = (valor) =>
      typeof valor === "string" && /^\d+$/.test(valor.trim());

    if (typeof nombre !== "string" || nombre.trim().length === 0 || soloNumeros(nombre)) {
      return res
        .status(400)
        .json({ error: "El nombre debe ser un texto válido" });
    }

    if (typeof apellido !== "string" || apellido.trim().length === 0 || soloNumeros(apellido)) {
      return res
        .status(400)
        .json({ error: "El apellido debe ser un texto válido" });
    }

    // Validar que DNI y teléfono sean numéricos
    const esNumerico = (valor) => /^\d+$/.test(String(valor).trim());

    if (!esNumerico(dni)) {
      return res
        .status(400)
        .json({ error: "El DNI debe contener solo números" });
    }

    if (!esNumerico(telefono)) {
      return res
        .status(400)
        .json({ error: "El teléfono debe contener solo números" });
    }

    const nuevoUsuario = await Usuario.createUsuario(
      nombre.trim(),
      apellido.trim(),
      String(dni).trim(),
      String(telefono).trim(),
      id_turno
    );
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await Usuario.deleteUsuario(id);
    res.status(204).send();
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, telefono } = req.body; // ← tenía "email" que no existe en la tabla
    const usuarioActualizado = await Usuario.updateUsuario(id, nombre, apellido, dni, telefono);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};