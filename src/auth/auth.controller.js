import {hash, verify} from 'argon2';
import Usuario from '../users/user.model.js';
import Compras from '../compras/compras-model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const login = async(req, res) => {
    const { email, password, username } = req.body;

    try {
        
        const user = await Usuario.findOne({
            $or: [
                {username}, {email}
            ]
        })

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, usuario no existe en la base de datos'
            });
        }

        if (!user.state) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta, bobo'
            })
        }

        const token = await generarJWT(user.id);

        const compra = await Compras.find({titular: user.id})
        .populate('titular', 'user username -_id')
        .populate('productos', 'producto name precio -_id');       

        res.status(200).json({
            msg: 'Inicio de sesion exitoso!',
            userDetails: {
                username: user.username,
                token: token,
                compras: compra
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const register = async(req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }
}