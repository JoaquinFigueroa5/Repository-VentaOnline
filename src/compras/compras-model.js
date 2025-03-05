import { Schema, model } from 'mongoose';

const ComprasSchema = new Schema({
    titular: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productos: [{
        producto: { 
            type: Schema.Types.ObjectId, 
            ref: "Producto", 
            required: true 
        },
        cantidad: { 
            type: Number, 
            default: 1 
        }
    }],
    total: {
        type: Number,
        required: true,
        validate: {
            validator: (v) => v >= 0,
            message: "El total no puede ser negativo"
        }
    },
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Compras', ComprasSchema);
