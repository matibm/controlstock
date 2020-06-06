var express = require('express');

var app = express()
var Producto = require('../models/producto');


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                messaje: 'Peticion realizada correctamente',
                productos: productos
            })
        })

})

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id).exec((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            producto: producto
        });
    });
})

app.post('/', (req, res) => {

    let producto = new Producto(req.body);


    producto.save((err, productoSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });


        };

        res.status(200).json({
            ok: true,
            messaje: 'producto guardado correctamente',
            producto: productoSaved
        });

    })
})
app.put('/decrementar', (req, res) => {

    let arregloObjetos = req.body
    for (let index = 0; index < arregloObjetos.length; index++) {
        const id = arregloObjetos[index].id;
        const cantidad = arregloObjetos[index].cantidad;
        Producto.findById(id, (err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                });
            };

            producto.stock -= cantidad

            producto.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error al guardar el producto',
                        errors: err
                    });
                };


            })
        })
    }
    res.status(200).json({
        ok: true,
        messaje: 'productos actualizado correctamente'
    })


})


app.put('/:id', (req, res) => {

    let productoNuevo = req.body
    let id = req.params.id

    Producto.findById(id, (err, producto) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });
        };

        producto.marca = productoNuevo.marca
        producto.codigo = productoNuevo.codigo
        producto.precio = productoNuevo.precio
        producto.descuento = productoNuevo.descuento
        producto.precioBruto = productoNuevo.precioBruto
        producto.modelo = productoNuevo.modelo
        producto.stock = productoNuevo.stock
        producto.img = productoNuevo.img
        console.log(producto);

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al guardar el producto',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                messaje: 'producto actualizado correctamente',
                producto: productoGuardado
            })

        })
    })
})

app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id).exec((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
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