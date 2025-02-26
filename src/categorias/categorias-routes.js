import { Router } from 'express';
import { saveCategorias, getCategorias } from './categorias-controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        validarCampos
    ],
    saveCategorias
)

router.get('/', getCategorias)

export default router;