var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    marca: { type: String, required: [true, 'La marca es necesaria'] },
    img: { type: String, required: false },
    codigo: { type: String, required: false },
    precio: { type: Number, required: true },
    modelo: { type: String, required: false },
    precioBruto: { type: Number, required: true },
    cantidad: { type: Number, required: true, default: 0 },
    descuento: { type: Number, required: false },
    desc: { type: Boolean, required: false, default: false },
    stock: { type: Number, required: true, default: 0 },
    proveedor: { type: String, required: false },
    stockMinimo: { type: Number, required: false },


}, { collection: 'productos' });

module.exports = mongoose.model('Producto', productoSchema);