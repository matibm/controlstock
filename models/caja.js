var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cajaSchema = new Schema({
    facturas: { type: Array },
    egresos: { type: Array },
    ingresos: { type: Array },
    cobros: { type: Array },
    fechaInicio: { type: Number, required: true },
    fechaCierre: { type: Number, required: false },
    montoFijo: { type: Number, required: true },
    montoVentas: { type: Number, required: false, default: 0 },
    montoEgresos: { type: Number, required: false, default: 0 },
    montoCobros: { type: Number, required: false, default: 0 },
    montoIngresos: { type: Number, required: false, default: 0 },
    comisionIngresos: { type: Number, required: false },
    costoVentas: { type: Number, required: false, default: 0 },
    cerrado: { type: Boolean, default: false }

}, { collection: 'cajas' });

module.exports = mongoose.model('Cajas', cajaSchema);