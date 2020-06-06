var express = require('express');

var app = express()
var Factura = require('../models/factura');


app.get('/', (req, res, next) => {
    Factura.find((err, facturas) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            facturas: facturas
        })
    })

})

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Factura.findById(id).exec((err, factura) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            factura: factura
        });
    });
})

// get factura por cliente 
app.get('/cliente/:id', (req, res) => {
    let id = req.params.id;
    Factura.find({ cliente: id }).exec((err, facturas) => {
        if (err) {
            return
        }
        res.status(200).json({
            ok: true,
            facturas: facturas
        })
    })
})

app.post('/', (req, res) => {

    let factura = new Factura(req.body);

    factura.save((err, facturaSaved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };
        console.log(facturaSaved);

        res.status(200).json({
            ok: true,
            messaje: 'factura guardado correctamente',
            factura: facturaSaved
        });

    })
})

app.put('/:id', (req, res) => {
    let facturaNuevo = req.body
    let id = req.params.id

    Factura.findById(id, (err, factura) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };

        factura.marca = facturaNuevo.marca
        factura.codigo = facturaNuevo.codigo
        factura.precio = facturaNuevo.precio
        factura.precioBruto = facturaNuevo.precioBruto
        factura.modelo = facturaNuevo.modelo
        factura.cantidad = facturaNuevo.cantidad
        factura.debiendo = facturaNuevo.debiendo

        factura.save((err, facturaGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    messaje: 'Error al guardar el factura',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                messaje: 'factura actualizado correctamente',
                factura: facturaGuardado
            })

        })
    })
})

app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Factura.findByIdAndRemove(id).exec((err, factura) => {
        if (err) {
            res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
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