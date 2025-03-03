import Compras from "./compras-model";
import Producto from "../productos/pruductos-model";

export const saveCompras = async(req, res) => {
    
    try {
        const { productos } = req.body;
        const producto = await Producto.fin({ name: { $in: productos }});
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al agregar carrito de compras",
            error: error.message || error
        })
    }
}