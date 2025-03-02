import User from "../users/user.model.js";

export const deleteRestricted = async(req, res, next) => {
    const { id } = req.params
    const usuarioRol = req.user.role;
    const authenticatedUser = req.user.id;

    try {  
        if(authenticatedUser !== id){
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