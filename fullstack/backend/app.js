import express from "express";
import cors from "cors";
import turnosRoutes from "./routes/turno_route.js";
import usuarioRoutes from "./routes/usuario_routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://turnero-pearl.vercel.app",
    ],
  }),
);
app.use(express.json());

app.use("/api/turnos", turnosRoutes);
app.use("/api/usuarios", usuarioRoutes);

export default app;