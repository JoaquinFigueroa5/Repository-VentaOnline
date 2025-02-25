import User from './user.model.js'

export const getUsers = async(req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };
        
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los usuarios",
            error
        })
    }
}