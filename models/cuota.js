var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cuotaSchema = new Schema({
  factura: { type: Schema.Types.ObjectId, ref: 'Factura', required: true },
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  nro_cuota: { type: Schema.Types.Number, required: true },
  fecha_creacion: { type: Schema.Types.Number, required: true },
  fecha_vencimiento: { type: Schema.Types.Number, required: true },
  fecha_pagado: { type: Schema.Types.Number, required: false },
  pagado: { type: Schema.Types.Boolean, required: false },  
  monto_total: { type: Schema.Types.Number, required: true },  
  monto_cuota: { type: Schema.Types.Number, required: true },  
  cant_cuotas: { type: Schema.Types.Number, required: true },  

}, { collection: 'cuotas' });

module.exports = mongoose.model('Cuota', cuotaSchema);