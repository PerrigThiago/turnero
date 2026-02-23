import { Router } from "express";
import { crearTurno, listarTurnos } from "../controllers/turnoController.js";

const router = Router();

router.get("/", listarTurnos);
router.post("/", crearTurno);

export default router;