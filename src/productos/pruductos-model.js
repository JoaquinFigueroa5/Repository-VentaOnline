import {Schema, model} from 'mongoose';

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        maxLenght: [25, 'No puede sobrepasar los 25 caracteres']
    },
    descripcion: {
        type: String,
        required: true,
        minLenght: [4, "Tiene que ser mayor a 4 caracteres"]
    },
    precio: {
        type: Double,
        required: true,
        min: [0, "El precio no puede ser negativo"]
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
}, {
    timeStamps: true,
    versionKey: false
});

export default model('Producto', ProductoSchema)