var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var facturaSchema = new Schema({
    productos: { type: Array, required: true },
    fecha: { type: Number, required: true },
    monto: { type: Number, required: true },
    cliente: { type: Schema.Types.ObjectId, required: false },
    debiendo: { type: Boolean, required: false, default: false }

}, { collection: 'facturas' });

module.exports = mongoose.model('Factura', facturaSchema);