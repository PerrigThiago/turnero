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
    const nuevoUsuario = await Usuario.createUsuario(nombre, apellido, dni, telefono, id_turno);
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