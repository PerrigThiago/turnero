import { Router } from "express";
import {
  listarTurnos,
  obtenerTurno,
  crearTurno,
  eliminarTurno,
  actualizarTurno 
} from "../controllers/turnoController.js";

const router = Router();

router.get("/", listarTurnos);
router.get("/:id", obtenerTurno);
router.post("/", crearTurno);
router.delete("/:id", eliminarTurno);
router.put("/:id", actualizarTurno);

export default router;