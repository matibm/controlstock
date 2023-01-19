var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var facturaSchema = new Schema({
    productos: { type: Array, required: true },
    fecha: { type: Number, required: true },
    monto: { type: Number, required: false },
    costo: { type: Number, required: false },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: false },
    debiendo: { type: Boolean, required: false, default: false },
    fechaPago: { type: Number, required: false },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: false
    },
    descuento: { type: Number, required: false, default: 10 },
    es_cuota: { type: Boolean, required: false, default: false }

}, { collection: 'facturas' });

module.exports = mongoose.model('Factura', facturaSchema);