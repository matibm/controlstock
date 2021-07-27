var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sucursalSchema = new Schema({

    nombre: { type: String, required: true }, 
}, { collection: 'sucursales' });

module.exports = mongoose.model('Sucursal', sucursalSchema);