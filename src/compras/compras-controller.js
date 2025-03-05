import Compras from "./compras-model.js";
import Producto from "../productos/pruductos-model.js";
import User from "../users/user.model.js";

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
                .populate('productos', 'name precio -_id')
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

        const compraExistente = await Compras.findById(id);
        if (!compraExistente) {
            return res.status(404).json({
                success: false,
                msg: "Compra no encontrada"
            });
        }

        // 2️⃣ Verificar si hay productos nuevos para actualizar
        let productosIds = [];
        let nuevoTotal = 0;
        if (productos && Array.isArray(productos) && productos.length > 0) {
            const productosEncontrados = await Producto.find(
                { name: { $in: productos } }, 
                "_id precio"
            );

            console.log("Productos encontrados en la BD:", productosEncontrados);

            if (productosEncontrados.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Los productos enviados no existen en la base de datos"
                });
            }

            productosIds = productosIds.map(prod => prod._id);
            nuevoTotal = productosEncontrados.reduce((sum, prod) => sum + prod.precio, 0);
        }

        const updateCompra = await Compras.findByIdAndUpdate(
            id,
            { 
                ...data, ...(productosIds.length > 0 && { productos: productosIds }),
                total: nuevoTotal
            },
            { new: true }
        )
        .populate('productos', 'name precio -_id')
        .populate('titular', 'user username -_id');

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