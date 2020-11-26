var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var recargaSchema = new Schema({

    fecha: { type: Number, required: true },
    productos: { type: Array, required: false },
    monto: { type: Number },
    nfactura: { type: String },
    comentario: { type: String, required: false }


});


module.exports = mongoose.model('Recarga', recargaSchema);