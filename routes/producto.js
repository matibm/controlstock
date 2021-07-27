var express = require('express');

var app = express()
var Producto = require('../models/producto');
var Stock = require('../models/stock');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;


app.get('/get_stock', async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        let stocks = await Stock.find({ producto: ObjectId(id) }).populate('sucursal ')
        res.status(200).json({
            ok: true,
            stocks
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            messaje: 'Error al cargar stocks',
            errors: error
        })
    }
})
app.get('/actualizar_comision', (req, res) => {

    let producto = new Producto(req.body);

    Producto.find({}).exec((err, data) => {
        for (let o = 0; o < data.length; o++) {
            const producto = data[o];
            data[o].comision = 10;
            data[o].save()

        }
    })

    res.status(200).json({
        ok: true,
        messaje: 'productos guardado correctamente',

    });

})

app.get('/', async (req, res, next) => {

    try {


        var desde = req.query.desde || 0;
        desde = Number(desde);

        let productos = await Producto.aggregate([
            {
                $lookup: {
                    from: 'stocks',
                    let: { productoId: '$_id' },
                    pipeline: [
                        { $match: { "$expr": { "$eq": ["$producto", '$$productoId'] } } },

                        {
                            $group: {
                                _id: null,
                                cantidad: { $first: '$cantidad' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,

                            }
                        }
                    ],
                    as: 'stock'
                }
            },
            {
                "$unwind": {
                    "path": "$stock",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $set: { stock: '$stock.cantidad' }
            },

           
            { $skip: desde },
            { $limit: 6 }
        ])


        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            productos: productos
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            messaje: 'Error al cargar productos',
            errors: err
        })
    }

    console.log(productos);

    // Producto.find({}).sort({ marca: 1 })
    //     .skip(desde)
    //     .limit(6)
    //     .exec((err, productos) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 messaje: 'Error al cargar productos',
    //                 errors: err
    //             })
    //         }
    //         res.status(200).json({
    //             ok: true,
    //             messaje: 'Peticion realizada correctamente',
    //             productos: productos.reverse()
    //         })
    //     })
})

app.get('/all', (req, res, next) => {



    Producto.find({})
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
app.get('/proveedor/:idproveedor', (req, res, next) => {
    let proveedorid = req.params.idproveedor;


    Producto.find({}).sort({ marca: 1 })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                })
            }

            let aux = []

            productos.forEach(producto => {
                if (producto.proveedor) {
                    if (producto.proveedor == proveedorid) {
                        aux.push(producto);
                    }
                }
            })

            res.status(200).json({
                ok: true,
                messaje: 'Peticion realizada correctamente',
                productos: aux
            })
        })

})



app.get('/faltantes', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                })
            }
            let faltantes = new Array();
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                if (producto.stock == 0) {
                    faltantes.push(producto)
                }
            }
            res.status(200).json({
                ok: true,
                messaje: 'Peticion realizada correctamente',
                productos: faltantes
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
    let body = req.body
    let stocks = req.body.stocks
    delete body.stocks
    console.log(stocks);
    let producto = new Producto(body);

    producto.save(async (err, productoSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });
        };

        for (let i = 0; i < stocks.length; i++) {
            const stock = stocks[i];
            let st = {
                producto: producto._id,
                sucursal: stock._id,
                cantidad: stock.stock
            }
            await Stock.insertMany([st])
        }

        res.status(200).json({
            ok: true,
            messaje: 'producto guardado correctamente',
            producto: productoSaved
        });
    })
})
app.put('/decrementar', async (req, res) => {
    let productosEnNegativo = []
    let arregloObjetos = req.body
    for (let index = 0; index < arregloObjetos.length; index++) {
        const id = arregloObjetos[index].id;
        const cantidad = arregloObjetos[index].cantidad;
        let producto = await buscarProducto(id, cantidad)
        if (!producto) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
            });
        }
        producto.stock -= cantidad;
        if (producto.stock >= 0) {
            await guardarProducto(producto);
        } else {
            productosEnNegativo.push(producto);
        }


    }
    if (productosEnNegativo.length > 0) {
        res.status(200).json({
            ok: false,
            messaje: 'producto se vendio mas de lo que habia',
            productos: productosEnNegativo
        })
    } else {
        res.status(200).json({
            ok: true,
            messaje: 'productos actualizado correctamente'
        })
    }




})

async function buscarProducto(id, cantidad) {
    let p = await Producto.findById(id, (err, producto) => {
        // if (err) {
        //     console.log("error", err);
        //     return err;
        // };

        // return producto;
    }).catch(err => {
        return err
    }).then(res => {
        return res
    })
    return p
}

async function guardarProducto(producto) {
    return await producto.save((err, productoGuardado) => {
        if (err) {
            return null;
        };
        return productoGuardado;
    })
}

app.put('/multiple', (req, res) => {

    let arr = req.body
    let producto
    console.log(arr);
    arr.forEach(async (productoNuevo) => {
        try {

            producto = await Producto.findById(productoNuevo._id)
            producto.marca = productoNuevo.marca
            producto.codigo = productoNuevo.codigo
            producto.precio = productoNuevo.precio
            producto.descuento = productoNuevo.descuento
            producto.precioBruto = productoNuevo.precioBruto
            producto.modelo = productoNuevo.modelo
            producto.stock += Math.abs(productoNuevo.cantidad)
            producto.img = productoNuevo.img
            producto.proveedor = productoNuevo.proveedor
            producto.stockMinimo = productoNuevo.stockMinimo
            producto.comision = productoNuevo.comision

            await producto.save()

        } catch {

            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });
        }
    })

    res.status(200).json({
        ok: true,
        messaje: 'productos actualizados '
    })

})

app.put('/:id', (req, res) => {

    let productoNuevo = req.body
    let id = req.params.id

    Producto.findById(id, (err, producto) => {
        if (err) {
            // // console.log("error", err);

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
        producto.proveedor = productoNuevo.proveedor
        producto.stockMinimo = productoNuevo.stockMinimo

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