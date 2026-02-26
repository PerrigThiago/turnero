import pool from "../config/bd.js";

export const createTurno = async (detalle) => {
  const result = await pool.query(
    "INSERT INTO turno (detalle, fecha_registro) VALUES ($1, NOW()) RETURNING *",
    [detalle]
  );
  return result.rows[0];
};

export const getTurnos = async () => {
  const result = await pool.query(
    "SELECT * FROM turno ORDER BY fecha_registro DESC"
  );
  return result.rows;
};

export const updateTurno = async (id, detalle) => {
  const result = await pool.query(
    `UPDATE turno
     SET detalle = $1
     WHERE id = $2
     RETURNING *`,
    [detalle, id]
  );
  return result.rows[0];
};