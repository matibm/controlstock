var express = require('express');

var app = express()

var CierreCaja = require('../models/caja');

app.get('/filtrar/:desde', (req, res, next) => {

    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();
    CierreCaja.find().and([{ fechaInicio: { $gt: desde } }, { fechaCierre: { $lt: hasta } },  ]).exec((err, cierreCajas) => {
        if (err) {
            return res.status(500).json({
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
app.get('/', (req, res, next) => {
    CierreCaja.find((err, cierreCajas) => {
        if (err) {
            return res.status(500).json({
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
app.get('/abierta/', (req, res, next) => {
    CierreCaja.find({ cerrado: { $eq: false } }).exec((err, caja) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar cierreCajas',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            caja: caja[0]
        })
    })
})


app.put('/:id', (req, res) => {
    let cierreCajaNuevo = req.body
    let id = req.params.id
    CierreCaja.findById(id, (err, cierreCaja) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };
        if (!cierreCajaNuevo) {
            return res.status(400).json({
                ok: false,
                messaje: 'el body esta undefined'

            });
        }
        cierreCaja.facturas = cierreCajaNuevo.facturas
        cierreCaja.egresos = cierreCajaNuevo.egresos
        cierreCaja.ingresos = cierreCajaNuevo.ingresos
        cierreCaja.cobros = cierreCajaNuevo.cobros
        cierreCaja.montoFijo = cierreCajaNuevo.montoFijo
        cierreCaja.montoVentas = cierreCajaNuevo.montoVentas
        cierreCaja.montoCobros = cierreCajaNuevo.montoCobros
        cierreCaja.montoEgresos = cierreCajaNuevo.montoEgresos
        cierreCaja.montoIngresos = cierreCajaNuevo.montoIngresos
        cierreCaja.fechaInicio = cierreCajaNuevo.fechaInicio
        cierreCaja.fechaCierre = cierreCajaNuevo.fechaCierre
        cierreCaja.costoVentas = cierreCajaNuevo.costoVentas
        cierreCaja.comisionIngresos = cierreCajaNuevo.comisionIngresos
        cierreCaja.cerrado = cierreCajaNuevo.cerrado

        cierreCaja.save((err, cierreCajaGuardado) => {
            if (err) {
                return res.status(500).json({
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
            return res.status(500).json({
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
            return res.status(500).json({
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