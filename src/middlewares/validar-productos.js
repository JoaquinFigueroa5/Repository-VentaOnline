import User from "../users/user.model.js";
import Producto from "../productos/pruductos-model.js";
import Compras from "../compras/compras-model.js";

export const deleteDeleProducto = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.role;
    try {
        if(authenticatedUser !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "Un cliente no puede manipular productos"
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de la eliminacion",
            error: error.message || error
        })
    }
}

export const limitStock = async(req, res, next) => {
    try {
        const comprasUsuario = await Compras.find({ titular: req.user._id }).populate('productos');
        const productosVarios = comprasUsuario.flatMap(compra => compra.productos);

        const stock = productosVarios.some(prod => prod.stock <= 0);
        const productos = await Producto.find({ stock: 0 }).select('name');
        const productoDetalles = await productos.map(prod => prod.name).join(', ');
        
        if(stock){
            return res.status(403).json({
                success: false,
                msg: `No se encuentra ${productoDetalles} en stock`
            })
        }
        
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de stock",
            error: error.message || error
        })
    }
}