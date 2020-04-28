var express = require('express');

var app = express()

var Egreso = require('../models/egreso');

app.get('/', (req, res, next) => {
    Egreso.find((err, egresos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar egresos',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            egresos: egresos
        })
    })

})

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Egreso.findById(id).exec((err, egreso) => {
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
            egreso: egreso
        });
    });
})

app.post('/', (req, res) => {

    let egreso = new Egreso(req.body);
    egreso.save((err, egresoSaved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar egresos',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'egreso guardado correctamente',
            egreso: egresoSaved
        });
    })
})




app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Egreso.findByIdAndRemove(id).exec((err, egreso) => {
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