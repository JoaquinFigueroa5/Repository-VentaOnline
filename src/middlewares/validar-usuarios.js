import User from "../users/user.model.js";

export const deleteRestricted = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const authenticatedUser = req.user.id;

    try {  
        if(user !== "ADMIN_ROLE" && authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "No puede eliminar otros usuarios que no sea el suyo"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion para eliminar"
        })
    }
}

export const RestrictedUser = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const authenticatedUser = req.user.id;

    try {
        console.log(user)
        if(user !== "ADMIN_ROLE" && authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "Solo puede editar su propio usuario"
            });

        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de la actualizacion",
            error: error.message || error
        })
    }
}
