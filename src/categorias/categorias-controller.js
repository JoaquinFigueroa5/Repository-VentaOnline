import Categoria from "./categorias-model.js";
import Producto from "../productos/pruductos-model.js";

export const saveCategorias = async(req, res) => {
    try {
        const data = req.body;
        
        const categoria = new Categoria({
            nombre: data.nombre,
            descripcion: data.descripcion
        });

        await categoria.save();

        res.status(200).json({
            success: true,
            msg: "Categoria agregada con exito",
            categoria
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear la categoria",
            error: error.message || error
        })
    }
}

export const getCategorias = async(req, res) => {
    const query = { state: true }
    try {
        const [total, categoria] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
        ]);

        return res.status(200).json({
            success: true,
            msg: "Categorias obtenidas con exito",
            total,
            categoria
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener categorias"
        })
    }
}

export const deleteCategoria = async(req, res) => {
    try {
        const { id } = req.params;
        const categoriaDefecto = await Categoria.findOne({ nombre: "Hogar"})

        await Producto.updateMany(
            { categoria: id },
            { categoria: categoriaDefecto._id }
        )

        const categoria = await Categoria.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Categoria eliminada con exito",
            categoria
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoria",
            error: error.message || error
        })
    }
}

export const updateCategoria = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const updateCategoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Categoria actualizada con exito",
            categoria: updateCategoria
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la categoria",
            error: error.message || error
        })
    }
}