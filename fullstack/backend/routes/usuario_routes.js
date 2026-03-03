import { Router } from "express";  
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.post("/", crearUsuario);
router.delete("/:id", eliminarUsuario);
router.put("/:id", actualizarUsuario);