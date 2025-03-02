import { Router } from "express";
import { check } from "express-validator";
import { getUsers, deleteUser } from './user.controller.js'
import { deleteRestricted } from '../middlewares/validar-usuarios.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", getUsers)

router.delete(
    '/:id',
    [
        validarJWT,
        deleteRestricted,
        validarCampos
    ],
    deleteUser
)

export default router;
