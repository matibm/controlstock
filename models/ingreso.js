var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ingresoSchema = new Schema({

    fecha: { type: Number, required: true },
    monto: { type: Number, required: true },
    comision: { type: Number, required: false },

    nombre: { type: String, required: true }


}, { collection: 'ingresos' });

module.exports = mongoose.model('Ingreso', ingresoSchema);