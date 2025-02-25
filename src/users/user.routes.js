import { Router } from "express";
import { check } from "express-validator";
import { getUsers } from './user.controller.js'
/* import { onlyOneStudent } from '../middlewares/validar-usuarios.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js"; */

const router = Router();

router.get("/", getUsers)

export default router;
