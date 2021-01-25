var express = require('express');
var mongoose = require('mongoose');
var app = express();

var fs = require('fs');
var Producto = require('../models/producto');

app.get('/producto/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')


    Promise.all([buscarUsuarios(busqueda, regex)]).then(respuestas => {
        res.status(200).json({
            ok: true,
            productos: respuestas[0]
        });
    });
})

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Producto.find({})
            .limit(50)
            .or([{ 'marca': regex }, { 'codigo': regex }, { 'modelo': regex }])
            .exec((err, producto) => {
                if (err) {
                    reject('Error al cargar productos', err)
                } else {
                    resolve(producto)
                }
            })
    })
}

module.exports = app