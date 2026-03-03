import pool from "../config/bd.js";

export const createTurno = async (detalle, fecha_turno) => {
  const result = await pool.query(
    `INSERT INTO turno (detalle, fecha_turno, fecha_registro)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [detalle, fecha_turno]
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

export const deleteTurno = async (id) => {
  await pool.query(
    "DELETE FROM turno WHERE id = $1",
    [id]
  );
};
