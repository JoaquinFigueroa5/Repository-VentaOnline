import Producto from "./pruductos-model.js";
import Categoria from "../categorias/categorias-model.js";
import Compras from "../compras/compras-model.js";

export const saveProducto = async(req, res) => {
    try {
        const data = req.body;

        const categorias = await Categoria.findOne({ nombre: data.categoria })

        const producto = new Producto({
            name: data.name,
            descripcion: data.descripcion,
            precio: data.precio,
            categoria: categorias._id,
            stock: data.stock
        })

        await producto.save();

        const conCategoria = await Producto.findById(producto._id).populate("categoria", "nombre -_id");

        res.status(200).json({
            success: true,
            msg: "Producto agregado con exito",
            producto: conCategoria
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al agregar el producto",
            error: error.message || error
        })
    }
}

export const getProductos = async(req, res) => {
    const { ordenar } = req.query;
    const query = { state: true };
    try {
        const [total, producto] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate("categoria", "nombre -_id")
                .sort(
                    ordenar === "agotados" ? { stock: 1 } :
                    ordenar === "MasVendidos" ? { ventas: 1} :
                    undefined)
        ])

        return res.status(200).json({
            success: true,
            msg: "Productos obtenidos con exito",
            total,
            producto
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener el inventario"
        })
    }
}

export const saerchProducto = async(req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id);

        if(!producto){
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado"
            })
        }

        const categoria = await Categoria.findById(producto.categoria);

        res.status(200).json({
            success: true,
            producto: {
                ...producto.toObject(),
                categoria: categoria ? categoria.nombre : "Categoria no encontrada"
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar el producto",
            error: error.message || error
        })
    }
}

export const deleteProducto = async(req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id)
        .populate("categoria", "nombre -_id");

        res.status(200).json({
            success: true,
            msg: "Exito al eliminar el producto",
            producto
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al querer eliminar el producto",
            error: error.message || error
        })
    }
}