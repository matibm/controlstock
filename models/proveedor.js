var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var proveedorSchema = new Schema({

    nombre: { type: String, required: true },
    telefono: { type: String, required: false },
    comentario: { type: String, required: false }


});


module.exports = mongoose.model('Proveedor', proveedorSchema);