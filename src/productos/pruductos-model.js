import {Schema, model} from 'mongoose';

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        maxlength: [25, 'No puede sobrepasar los 25 caracteres']
    },
    descripcion: {
        type: String,
        required: true,
        minlength: [4, "Tiene que ser mayor a 4 caracteres"]
    },
    precio: {
        type: Schema.Types.Decimal128,
        required: true,
        validate: {
            validator: (v) => v >= 0,
            message: "El precio no puede ser negativo"
        }
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    ventas: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Producto', ProductoSchema)