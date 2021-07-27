var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var stockSchema = new Schema({

    cantidad: { type: Number, required: true }, 
    producto: { type: Schema.Types.ObjectId, ref: 'Producto' }, 
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }, 
    
}, { collection: 'stocks' });

module.exports = mongoose.model('Stock', stockSchema);