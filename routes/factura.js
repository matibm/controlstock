var express = require('express');

var app = express()
var Factura = require('../models/factura');
var Producto = require('../models/producto');


app.get('/:desde', (req, res, next) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();

    Factura.find({ fecha: { $gt: desde, $lt: hasta } }).exec((err, facturas) => {
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

        factura.marca = facturaNuevo.marca
        factura.codigo = facturaNuevo.codigo
        factura.precio = facturaNuevo.precio
        factura.precioBruto = facturaNuevo.precioBruto
        factura.modelo = facturaNuevo.modelo
        factura.cantidad = facturaNuevo.cantidad
        factura.debiendo = facturaNuevo.debiendo

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

    Factura.findById(id).exec(async(err, factura) => {
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


async function buscarProducto(id) {
    let p = await Producto.findById(id).catch(err => {
        return err
    }).then(res => {
        return res
    })
    return p
}

module.exports = app