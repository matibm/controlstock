var express = require('express');

var app = express()

var Ingreso = require('../models/ingreso');

app.get('/:desde/', (req, res, next) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();
    Ingreso.find({ fecha: { $gt: desde, $lt: hasta } }).exec((err, ingresos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar ingresos',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            ingresos: ingresos
        })
    })
})

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Ingreso.findById(id).exec((err, ingreso) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar egresos',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            ingreso: ingreso
        });
    });
})

app.post('/', (req, res) => {

    let ingreso = new Ingreso(req.body);
    ingreso.save((err, ingresoSaved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al guardar ingreso',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'ingreso guardado correctamente',
            ingreso: ingresoSaved
        });
    })
})




app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Ingreso.findByIdAndRemove(id).exec((err, egreso) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar egresos',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'Eliminacion realizada correctamente'
        });
    });
})



module.exports = app