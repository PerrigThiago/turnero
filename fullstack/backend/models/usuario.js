import pool from "../config/bd.js";

export const createUsuario = async (id, nombre, apellido, dni, telefono) => {

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
        "UPDATE usuario SET * WHERE id = $N RETURNING *"
    );
    return result.rows;
};

export const deleteUsuario = async (id) => {
    const result = await pool.query(
        "DELETE FROM usuario WHERE id = $1"
    );
    return result.rows;
};