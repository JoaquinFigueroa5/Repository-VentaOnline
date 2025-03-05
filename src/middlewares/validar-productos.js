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

export const limitStock = async (req, res, next) => {
    try {
        const { productos } = req.body;
        const productosBD = await Producto.find({ name: { $in: productos.map(p => p.name) } });
        const productosSinStock = productos.filter(p => {
            const productoBD = productosBD.find(prod => prod.name === p.name);
            return !productoBD || productoBD.stock < p.cantidad;
        });

        if (productosSinStock.length > 0) {
            const nombresProductos = productosSinStock.map(p => p.name).join(', ');
            return res.status(403).json({
                success: false,
                msg: `No hay suficiente stock para: ${nombresProductos}`
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validación de stock",
            error: error.message || error
        });
    }
};
