import { Router } from 'express';
import { saveCategorias, getCategorias, deleteCategoria } from './categorias-controller.js';
import { onlyAdminCategoria } from '../middlewares/validar-categorias.js'
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        onlyAdminCategoria,
        validarCampos
    ],
    saveCategorias
)

router.get('/', getCategorias)

router.delete(
    '/:id',
    [
        validarJWT,
        validarCampos,
    ],
    deleteCategoria
)

export default router;