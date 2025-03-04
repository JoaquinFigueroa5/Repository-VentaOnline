import Compras from "./compras-model.js";
import Producto from "../productos/pruductos-model.js";

export const saveCompras = async(req, res) => {
    
    try {
        const titular = req.user._id;
        const { productos } = req.body;
        const producto = await Producto.find({ name: { $in: productos }});
        const total = producto.reduce((sum, prod) => sum + prod.precio, 0);

        if(producto.length !== productos.length){
            return res.status(404).json({
                success: false,
                msg: "Uno o mas productos no se encuentran disponibles."
            })
        }

        const compra = new Compras({
            titular: titular,
            productos: producto.map(prod => prod._id),
            total
        })

        await compra.save();

        const compraDetalles = await Compras.find()
        .populate('titular', 'user username -_id')
        .populate('productos', 'producto name -_id');

        res.status(200).json({
            success: true,
            msg: "Compra realizada con exito!",
            compra: compraDetalles
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al agregar carrito de compras",
            error: error.message || error
        })
    }
}