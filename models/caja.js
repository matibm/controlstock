var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cajaSchema = new Schema({
    facturas: { type: Array },
    egresos: { type: Array },
    ingresos: { type: Array },
    fechaInicio: { type: Number, required: true },
    fechaCierre: { type: Number, required: false },
    montoFijo: { type: Number, required: true },
    montoVentas: { type: Number, required: false },
    montoEgresos: { type: Number, required: false },
    montoIngresos: { type: Number, required: false },
    comisionIngresos: { type: Number, required: false },
    costoVentas: { type: Number, required: false },
    cerrado: { type: Boolean, default: false }

}, { collection: 'cajas' });

module.exports = mongoose.model('Cajas', cajaSchema);