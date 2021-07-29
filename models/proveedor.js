var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var proveedorSchema = new Schema({

    nombre: { type: String, required: true },
    ruc: { type: String, required: false },
    persona_contacto: { type: String, required: false },
    direccion: { type: String, required: false },
    email: { type: String, required: false },
    telefono: { type: String, required: false },
    comentario: { type: String, required: false }


});


module.exports = mongoose.model('Proveedor', proveedorSchema);