var express = require('express');

var app = express()

var Servicio = require('../models/servicio');

app.get('/ ', (req, res, next) => {

    Servicio.find().exec((err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar servicios',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            servicios: servicios
        })
    })

})

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Servicio.findById(id).exec((err, servicio) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar servicio',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            servicio: servicio
        });
    });
})


app.put('/:id', async(req, res) => {
    let id = req.params.id;
    let body = req.body;
    Servicio.findById(id).exec((err, servicio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar servicio',
                errors: err
            });
        };
        servicio.nombre = body.nombre
        servicio.comision = body.comision
        servicio.monto = body.monto
        servicio.save((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al actualizar servicio',
                    errors: err
                });
            };
            res.status(200).json({
                ok: true,
                messaje: 'servicio actualizado correctamente',
                servicio: servicioSaved
            });
        })

    })

})

app.post('/', (req, res) => {

    let servicio = new Servicio(req.body);
    servicio.save((err, servicioSaved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al guardar servicio',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'servicio guardado correctamente',
            servicio: servicioSaved
        });
    })
})




app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Servicio.findByIdAndRemove(id).exec((err, servicio) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar servicio',
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