var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var facturaSchema = new Schema({
    productos: { type: Array, required: true },
    fecha: { type: Number, required: true },
    monto: { type: Number, required: true },

}, { collection: 'facturas' });

module.exports = mongoose.model('Factura', facturaSchema);