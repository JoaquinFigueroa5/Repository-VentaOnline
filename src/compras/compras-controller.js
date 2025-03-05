import Compras from "./compras-model.js";
import Producto from "../productos/pruductos-model.js";
import User from "../users/user.model.js";

export const saveCompras = async (req, res) => {
    try {
        const titular = req.user._id;
        const { productos } = req.body;
        const nombresProductos = productos.map(p => p.name);
        const productosDB = await Producto.find({ name: { $in: nombresProductos } });

        if (productosDB.length !== productos.length) {
            return res.status(404).json({
                success: false,
                msg: "Uno o más productos no se encuentran disponibles."
            });
        }

        let total = 0;
        const productosCompra = productos.map(p => {
            const productoEncontrado = productosDB.find(prod => prod.name === p.name);
            if (productoEncontrado) {
                total += productoEncontrado.precio * p.cantidad;
                return {
                    producto: productoEncontrado._id,
                    cantidad: p.cantidad
                };
            }
        });

        for (const p of productosCompra) {
            await Producto.findByIdAndUpdate(p.producto, { 
                $inc: { ventas: p.cantidad, stock: -p.cantidad } 
            });
        }

        const compra = new Compras({
            titular: titular,
            productos: productosCompra,
            total
        });

        await compra.save();

        const compraDetalles = await Compras.findOne({ _id: compra._id })
            .populate('titular', 'user username -_id')
            .populate('productos.producto', 'name precio -_id');

        res.status(200).json({
            success: true,
            msg: "Compra realizada con éxito!",
            compra: compraDetalles
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al agregar carrito de compras",
            error: error.message || error
        });
    }
};


export const getComprasUser = async(req, res) => {
    try {
        const authenticatedUser = req.user.id;
        const compras = await Compras.find({ titular: authenticatedUser })
            .populate('productos', 'name precio -_id')
            .populate('titular', 'user username -_id');

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

export const getComprasAdmin = async(req, res) => {
    const query = { state: true }
    try {
        const [total, compras] = await Promise.all([
            Compras.countDocuments(query),
            Compras.find(query)
                .populate('productos.producto', 'name precio -_id')
                .populate('titular', 'user username -_id')
        ]);

        res.status(200).json({
            success: true,
            msg: "Facturas obtenidas con exito",
            total,
            compras
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las facturas"
        })
    }
}

export const updateCompras = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, productos, ...data } = req.body;

        const updateCompra = await Compras.findByIdAndUpdate(id)
            .populate('productos', 'name precio -_id')
            .populate('titular', 'user username -_id')

        res.status(200).json({
            success: true,
            msg: "Factura actualizada con exito",
            compra: updateCompra
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la factura",
            error: error.message || error
        })
    }
}