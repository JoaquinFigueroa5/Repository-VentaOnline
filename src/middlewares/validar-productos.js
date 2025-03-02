import User from "../users/user.model.js";

export const deleteDeleProducto = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.role;

    try {
        if(authenticatedUser === "CLIENT_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "Un usuario no puede eliminar productos"
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de la eliminacion",
            error: error.message || error
        })
    }
}