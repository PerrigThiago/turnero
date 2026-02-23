import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto 3000");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
});