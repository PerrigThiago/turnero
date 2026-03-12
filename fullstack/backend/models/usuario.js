import pool from "../config/bd.js";

export const createUsuario = async (nombre, apellido, dni, telefono, id_turno) => {
  const result = await pool.query(
    `INSERT INTO usuario (nombre, apellido, dni, telefono, id_turno)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nombre, apellido, dni, telefono, id_turno]
  );
  return result.rows[0];
};

export const getUsuario = async () => {
  const result = await pool.query(
    "SELECT * FROM usuario ORDER BY id DESC"
  );
  return result.rows;
};

export const getUsuarioById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM usuario WHERE id = $1",
    [id] // ← faltaba pasar el parámetro
  );
  return result.rows[0]; // ← era rows sin [0], devolvía array en vez de objeto
};

export const updateUsuario = async (id, nombre, apellido, dni, telefono) => {
  const result = await pool.query(
    `UPDATE usuario 
     SET nombre = $1, apellido = $2, dni = $3, telefono = $4
     WHERE id = $5
     RETURNING *`,
    [nombre, apellido, dni, telefono, id] // ← query original era inválida ("SET * WHERE id = $N")
  );
  return result.rows[0];
};

export const deleteUsuario = async (id) => {
  await pool.query(
    "DELETE FROM usuario WHERE id = $1",
    [id] // ← faltaba pasar el parámetro
  );
};