import { Router } from 'express';
import { saveCompras, getCompras } from './compras-controller.js';
import { limitStock } from '../middlewares/validar-productos.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        limitStock,
        validarCampos
    ],
    saveCompras
)

router.get('/', getCompras)

export default router;
// router.get('/', )