import pool from "../config/bd.js";

export const createUsuario = async (nombre, apellido, dni, telefono) => {
    const result = await pool.query(
        "INSERT INTO usuario (nombre, apellido, dni, telefono) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, apellido, dni, telefono]
    );
    return result.rows;
};

export const getUsuario = async () => {
    const result = await pool.query(
        "SELECT * FROM usuario ORDER BY id DESC"
    );
    return result.rows;
};

export const getUsuarioById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM usuario WHERE id = $1"
    );
    return result.rows;
};

export const updateUsuario = async (id, nombre, apellido, dni, telefono) => {
    const result = await pool.query(
        "UPDATE usuario SET nombre = $2, apellido = $3, dni = $4, telefono = $5 WHERE id = $1 RETURNING *",
        [id, nombre, apellido, dni, telefono]
    );
    return result.rows;
};

export const deleteUsuario = async (id) => {
    const result = await pool.query(
        "DELETE FROM usuario WHERE id = $1"
    );
    return result.rows;
};