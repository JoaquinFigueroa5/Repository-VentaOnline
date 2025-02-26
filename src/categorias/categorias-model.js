import {Schema, model} from 'mongoose'

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        maxLenght: [50, 'No puede sobrepasar los 50 caracteres']
    },
    descripcion: {
        type: String,
        maxLenght: [200, 'No puede sobrepasar los 200 caracteres']
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default model('Categoria', CategoriaSchema)