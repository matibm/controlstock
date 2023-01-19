var express = require('express');

var app = express()
var Factura = require('../models/factura');
var Producto = require('../models/producto');
var Cuota = require('../models/cuota');

app.get('/fecha_cobro', (req, res) => {
    let hoy = new Date()
    hoy.setHours(0);
    hoy = hoy.getTime()
    Factura.find({ fechaPago: { $gt: hoy } }).and([{ debiendo: true }]).populate('cliente').exec((err, data) => {
        if (err) {
            res.status(500).json({
                ok: false,
                error: err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            facturas: data
        })
    })
})


app.get('/:desde', (req, res, next) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();

    Factura.find({ fecha: { $gt: desde, $lt: hasta } }).sort({ fecha: -1 }).exec((err, facturas) => {
        if (err) {
            return res.status(500).json({
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
app.get('/masvendidos', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var hasta = req.query.hasta || new Date().valueOf();
    hasta = Number(hasta);
    Factura.find((err, facturas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            })
        }

        let facturasAux = new Array

        for (let i = 0; i < facturas.length; i++) {
            const factura = facturas[i];
            if (factura.fecha >= desde && factura.fecha <= hasta) {
                facturasAux.push(factura);
            }
        }

        facturas = facturasAux;

        Producto.find({}).exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                })
            }
            for (let i = 0; i < facturas.length; i++) {
                const factura = facturas[i];
                for (let j = 0; j < factura.productos.length; j++) {
                    const producto = factura.productos[j];
                    for (let k = 0; k < productos.length; k++) {
                        const element = productos[k];
                        if (element.codigo == producto.codigo) {
                            productos[k].cantidad += producto.cantidad;
                        }
                    }
                }
            }
            productos.sort(compare);
            productos = productos.reverse()
            res.status(200).json({
                ok: true,
                messaje: 'Peticion realizada correctamente',
                facturas: productos
            })
        })

    })
})

app.get('/debiendo', (req, res) => {
    Factura.find((err, facturas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            })
        }

        let facturasAux = new Array
        for (let i = 0; i < facturas.length; i++) {
            const factura = facturas[i];
            if (factura.debiendo) {
                facturasAux.push(factura)
            }
        }
        res.status(200).json({
            ok: true,
            facturas: facturasAux
        })
    })
})

app.get('/productosVendidos/:desde', (req, res) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();

    desde = Number(desde);

    hasta = Number(hasta);
    Factura.find((err, facturas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            })
        }

        let facturasAux = new Array

        for (let i = 0; i < facturas.length; i++) {
            const factura = facturas[i];
            if (factura.fecha >= desde && factura.fecha <= hasta) {
                facturasAux.push(factura);
            }
        }

        facturas = facturasAux;

        Producto.find({}).exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al cargar productos',
                    errors: err
                })
            }
            for (let i = 0; i < facturas.length; i++) {
                const factura = facturas[i];
                for (let j = 0; j < factura.productos.length; j++) {
                    const producto = factura.productos[j];
                    for (let k = 0; k < productos.length; k++) {
                        const element = productos[k];
                        if (element.codigo == producto.codigo) {
                            productos[k].cantidad += producto.cantidad;
                        }
                    }
                }
            }

            productos.sort(compare);
            productos = productos.reverse()
            let productosAuxiliar = []
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                if (producto.cantidad > 0) {
                    productosAuxiliar.push(producto)
                }
            }
            productos = productosAuxiliar;

            res.status(200).json({
                ok: true,
                messaje: 'Peticion realizada correctamente',
                productos: productos,
                desde: new Date(desde),
                hasta: new Date(hasta)
            })
        })
    })
})

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.cantidad
    const bandB = b.cantidad

    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}
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
    Factura.find({ cliente: id }).sort({ fecha: -1 }).exec((err, facturas) => {
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
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };
        // console.log(facturaSaved);

        res.status(200).json({
            ok: true,
            messaje: 'factura guardado correctamente',
            factura: facturaSaved
        });

    })
})
app.post('/crear_cuotas', async (req, res) => {
    try {

        let body = req.body
        let cuotas = []
        for (let i = 0; i < body.cant_cuotas; i++) {
            let fechaVencimiento = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 2 + i}- ${body.dia_vencimiento} 00:00:00`)
            cuotas.push({
                ...body,
                fecha_creacion: new Date().toISOString(),
                pagado: false,
                nro_cuota: i + 1,
                fecha_vencimiento: fechaVencimiento.getTime()
            })
            let c = new Cuota({
                ...body,
                fecha_creacion: new Date().getTime(),
                pagado: false,
                nro_cuota: i + 1,
                fecha_vencimiento: fechaVencimiento.getTime()
            })
            await c.save()
        }
        console.log(cuotas);
        res.send({ ok: true })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.post('/cobrar_cuota', async (req, res) => {
    try {

        let body = req.body
        let cuota = await Cuota.findById(body._id)
        cuota.pagado = true,
            cuota.fecha_pagado = new Date().getTime()
        await cuota.save()

        res.send({ ok: true })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.post('/cancelar_cobro', async (req, res) => {
    try {
        let body = req.body
        let cuota = await Cuota.findById(body._id)
        cuota.pagado = false,
            cuota.fecha_pagado = new Date().getTime()
        await cuota.save()

        res.send({ ok: true })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.get('/get_cuotas/:id', async (req, res) => {
    try {
        let id = req.params.id
        const cuotas = await Cuota.find({ cliente: id }).sort({ nro_cuota: 1 })
        res.send({ ok: true, cuotas })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.post('/get_all_cuotas', async (req, res) => {
    try {
        let body = req.body
        let pagado = {}
        if (body.tipo == 'pagado') {
            pagado = { pagado: true }
        }
        if (body.tipo == 'pendiente') {
            pagado = { pagado: false }
        }
        const cuotas = await Cuota.find({ fecha_vencimiento: { $gte: body.start, $lte: body.end }, ...pagado }).sort({ nro_cuota: 1 }).populate('factura cliente')
        res.send({ ok: true, cuotas })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.post('/get_cobros', async (req, res) => {
    try {
        let body = req.body

        const cuotas = await Cuota.find({ fecha_pagado: { $gte: body.desde, $lte: body.hasta } }).sort({ nro_cuota: 1 }).populate('factura cliente')
        res.send({ ok: true, cuotas })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/get_ventas_total', async (req, res) => {
    try {
        let body = req.body

        let facturas = await Factura.find({ fecha: { $gte: body.start, $lte: body.end } }).populate('cliente')
        
        res.send({ ok: true, facturas })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.put('/:id', (req, res) => {
    let facturaNuevo = req.body
    let id = req.params.id

    Factura.findById(id, (err, factura) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar facturas',
                errors: err
            });
        };

        factura.productos = facturaNuevo.productos
        factura.debiendo = facturaNuevo.debiendo
        factura.fecha = facturaNuevo.fecha


        factura.save((err, facturaGuardado) => {
            if (err) {
                return res.status(500).json({
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

    Factura.findById(id).exec(async (err, factura) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar factura',
                errors: err
            });
        };
        for (let i = 0; i < factura.productos.length; i++) {
            const productoFactura = factura.productos[i];
            let producto = await Producto.findById(productoFactura._id)
            producto.stock += productoFactura.cantidad
            await producto.save()
        }

        Factura.findByIdAndRemove(id).exec((err, factura) => {
            if (err) {
                return res.status(500).json({
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

})

app.get('/facturas_por_usuario/:id/:desde', (req, res) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();

    let id = req.params.id;
    Factura.find({ fecha: { $gt: desde, $lt: hasta }, usuario: id }).exec((err, data) => {
        if (err) {
            res.status(500).json({
                ok: false,
                error: err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            facturas: data
        })
    })
})

async function buscarProducto(id) {
    let p = await Producto.findById(id).catch(err => {
        return err
    }).then(res => {
        return res
    })
    return p
}

module.exports = app