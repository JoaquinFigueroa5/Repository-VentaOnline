import { Router } from 'express';
import { saveCompras, getComprasUser, getComprasAdmin, updateCompras } from './compras-controller.js';
import { limitStock } from '../middlewares/validar-productos.js';
import { onlyAdminFactura, confirmarCompra } from '../middlewares/validar-facturas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        limitStock,
        confirmarCompra,
        validarCampos
    ],
    saveCompras
)

router.get('/', validarJWT, getComprasUser)

router.get(
    '/admin',
    [
        validarJWT,
        onlyAdminFactura,
        validarCampos
    ],
    getComprasAdmin
)

router.put(
    '/:id',
    [
        validarJWT,
        onlyAdminFactura,
        validarCampos
    ],
    updateCompras
)

export default router;
