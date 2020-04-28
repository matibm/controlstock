var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cajaSchema = new Schema({
    facturas: { type: Array },
    egresos: { type: Array },
    fechaInicio: { type: Number, required: true },
    fechaCierre: { type: Number, required: false },
    montoInicio: { type: Number, required: true },
    montoCierre: { type: Number, required: false },
    cerrado: { type: Boolean, default: false }

}, { collection: 'cajas' });

module.exports = mongoose.model('Cajas', cajaSchema);