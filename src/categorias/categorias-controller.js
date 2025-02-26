import Categoria from "./categorias-model.js";

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

        const categoria = Categoria.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Categoria eliminada con exito",
            categoria
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error la eliminar la categoria",
            error: error.message || error
        })
    }
}