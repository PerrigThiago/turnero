import express from "express";
import cors from "cors";
import turnosRoutes from "./routes/turno_route.js";
import usuarioRoutes from "./routes/usuario_routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/turnos", turnosRoutes);
app.use("/api/usuario", usuarioRoutes);

export default app;