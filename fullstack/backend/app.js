import express from "express";
import cors from "cors";
import turnosRoutes from "./routes/turno_route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/turnos", turnosRoutes);

export default app;