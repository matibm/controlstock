var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var recargaSchema = new Schema({

    fecha: { type: Number, required: true },
    productoId: { type: Schema.Types.ObjectId, required: true },
    cantidadASumar: { type: Number, required: true },
    stockAnterior: { type: Schema.Types.Number, required: true },
    marca: { type: String, required: true },
    tipo: { type: String, required: true },
    comentario: { type: String, required: false }


});


module.exports = mongoose.model('Recarga', recargaSchema);