var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var servicioSchema = new Schema({

    monto: { type: Number, required: true },
    comision: { type: Number, required: false },
    nombre: { type: String, required: true }

}, { collection: 'servicios' });

module.exports = mongoose.model('Servicio', servicioSchema);