import Compras from "../compras/compras-model";

export const validarFacturas = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.id;
    const query = { state: true};
    try {
        const [total, compra] = await Promise.all([
            Compras.countDocuments(query),
            Compras.find(query)
        ])

        return res.status(200).json({
            success: true,
            total,
            factura: Compras.find(f => f._id.toString() === id) || "Factura no encontrada"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de facturas"
        })
    }

}