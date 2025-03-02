import Categoria from "../categorias/categorias-model.js";
import User from "../users/user.model.js";

export const defaultCategoria = async() => {
    try {
        const categoriaExists = await Categoria.findOne({ nombre: "Hogar"});

        if(!categoriaExists){
            const categoria = new Categoria({
                nombre: "Hogar",
                descripcion: "Todo lo que tiene que ver con la casa/hogar"            
            })
            
            await categoria.save();
            console.log("Categoria creada con exito");
        }else{
            console.log("Categoria HOGAR ya existente");
        }
    } catch (error) {
        console.log("Error al crear la categoria")
    }
}

export const notDeleteDCategoria = async() => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al NO eliminar la categoria",
            error: error.message || error
        })
    }
}

export const onlyAdminCategoria = async(req, res, next) => {
    const authenticatedUser = req.user.role;
    try {
        if(authenticatedUser !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "No tiene permiso para agregar una categoria."
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al validar categoria",
            error: error.message || error
        })
    }
}