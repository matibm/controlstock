var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var egresoSchema = new Schema({

    fecha: { type: Number, required: true },
    monto: { type: Number, required: true },
    motivo: { type: String, required: true }


}, { collection: 'egresos' });

module.exports = mongoose.model('Egreso', egresoSchema);