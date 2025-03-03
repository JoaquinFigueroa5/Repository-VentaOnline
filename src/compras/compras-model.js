import {Schema, model} from 'mongoose';

const ComprasSchema = Schema({
    titular: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: "producto",
        required: true,
    }],
    total: {
        type: Schema.Types.Decimal128,
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
},{
    timestamps: true,
    verisonkey: false
});

export default model('Compras', ComprasSchema)