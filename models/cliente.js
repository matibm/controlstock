var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;


var clienteSchema = new Schema({

    nombre: { type: String, required: false },
    ruc: { type: String, required: false },
    ci: { type: String, required: false },

});


module.exports = mongoose.model('Cliente', clienteSchema);