import Compras from "./compras-model.js";
import Producto from "../productos/pruductos-model.js";
import User from "../users/user.model.js";

export const saveCompras = async(req, res) => {
    const { id } = req.params;
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

        for (const prod of producto) {
            await Producto.findByIdAndUpdate(prod._id, { $inc: { ventas: 1 } });
        }

        for (const stock of producto) {
            await Producto.findByIdAndUpdate(stock._id, { $inc: { stock: -1}})
        }
        

        const compra = new Compras({
            titular: titular,
            productos: producto.map(prod => prod._id),
            total
        })

        await compra.save();

        const compraDetalles = await Compras.findOne({ titular: titular})
        .populate('titular', 'user username -_id')
        .populate('productos', 'producto name precio -_id');

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

export const getCompras = async(req, res) => {
    try {
        const authenticatedUser = req.user.id;
        const compras = await Usuario.find(authenticatedUser);

        console.log(compras);

        res.status(200).json({
            success: true,
            msg: "Facturas obtenidas correctamente!",
            compras
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al generar la factura",
            error: error.message || error
        })
    }
}