import pool from "../config/db.js";

export const getTurnos = async () => {
  const result = await pool.query("SELECT * FROM turnos ORDER BY fecha ASC");
  return result.rows;
};

export const createTurno = async (detalle, fecha) => {
  const result = await pool.query(
    "INSERT INTO turnos (detalle, fecha) VALUES ($1, $2) RETURNING *",
    [detalle, fecha]
  );
  return result.rows[0];
};