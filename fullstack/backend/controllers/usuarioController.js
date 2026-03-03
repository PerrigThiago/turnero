import * as Turno from "../models/usuario.js";

export const listarUsuarios = async (res) => {
  try {
    const usuarios = await Turno.getUsuarios();
    res.json(usuarios);
    } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Turno.getUsuarioById(id);
    res.json(usuario);
    } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: "El nombre y el email son obligatorios" });
    }
    const nuevoUsuario = await Turno.createUsuario(nombre, email);
    res.status(201).json(nuevoUsuario);
    } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: "Error al crear usuario" });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Turno.deleteUsuario(id);
        res.status(204).send();
    } catch (error) {        
        console.error("ERROR REAL:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;
        const usuarioActualizado = await Turno.updateUsuario(id, nombre, email);
        res.json(usuarioActualizado);
    } catch (error) {
        console.error("ERROR REAL:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};