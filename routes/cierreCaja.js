var express = require('express');

var app = express()

var CierreCaja = require('../models/caja');

app.get('/', (req, res, next) => {
    CierreCaja.find((err, cierreCajas) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar cierreCajas',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            cierreCajas: cierreCajas
        })
    })
})


app.put('/:id', (req, res) => {
    let cierreCajaNuevo = req.body
    let id = req.params.id

    CierreCaja.findById(id, (err, cierreCaja) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };

        cierreCaja.facturas = cierreCajaNuevo.facturas
        cierreCaja.egresos = cierreCajaNuevo.egresos
        cierreCaja.montoInicio = cierreCajaNuevo.montoInicio
        cierreCaja.montoCierre = cierreCajaNuevo.montoCierre
        cierreCaja.fechaInicio = cierreCajaNuevo.fechaInicio
        cierreCaja.fechaCierre = cierreCajaNuevo.fechaCierre
        cierreCaja.cerrado = cierreCajaNuevo.cerrado

        cierreCaja.save((err, cierreCajaGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    messaje: 'Error al guardar el cierreCaja',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                messaje: 'cierreCaja actualizado correctamente',
                cierreCaja: cierreCajaGuardado
            })

        })
    })
})


app.get('/:id', (req, res) => {
    let id = req.params.id;
    CierreCaja.findById(id).exec((err, cierreCaja) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar cierreCajas',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            cierreCaja: cierreCaja
        });
    });
})

app.post('/', (req, res) => {

    let cierreCaja = new CierreCaja(req.body);
    cierreCaja.save((err, egresoSaved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar cierreCajas',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'cierreCaja guardado correctamente',
            cierreCaja: egresoSaved
        });
    })
})


app.delete('/:id', (req, res) => {
    let id = req.params.id;
    CierreCaja.findByIdAndRemove(id).exec((err, cierreCaja) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar cierreCajas',
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