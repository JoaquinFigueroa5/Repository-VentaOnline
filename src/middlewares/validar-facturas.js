export const onlyAdminFactura = async(req, res, next) => {
    const authenticatedUser = req.user.role;
    try {
        if(authenticatedUser !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "No tiene permiso para modificar una factura."
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al validar factura",
            error: error.message || error
        })
    }
}