import { Router } from 'express';
import { saveProducto, getProductos, saerchProducto, deleteProducto, updateProducto } from './productos-controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { onlyAdminCategoria } from '../middlewares/validar-categorias.js';
import { deleteDeleProducto } from '../middlewares/validar-productos.js'

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        deleteDeleProducto,
        validarCampos
    ],
    saveProducto
)

router.get('/', getProductos)

router.get(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    saerchProducto
)

router.delete(
    '/:id',
    [
        validarJWT,
        deleteDeleProducto,
        validarCampos
    ],
    deleteProducto
)

router.put(
    '/:id',
    [
        validarJWT,
        onlyAdminCategoria,
        validarCampos
    ],
    updateProducto
)

export default router;