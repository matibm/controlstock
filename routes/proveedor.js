var express = require('express');
var path = require('path')
var app = express()
var Proveedor = require('../models/proveedor');



app.get('/all', async(req, res) => {

    let proveedores = await getProveedores()

    try {
        proveedores = await Proveedor.find().sort({ nombre: 1 })
        if (!proveedores) {
            throw new Error('no se encontraron proveedores')
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            messaje: 'Error al buscar proveedores',
            errors: error
        })
    }


    res.status(200).json({
        ok: true,
        messaje: 'Peticion realizada correctamente',
        proveedores: proveedores
    })
})

async function getProveedores() {
    return await Proveedor.find({}).exec((err, proveedores) => {
        if (err) {
            return err
        }
        return proveedores;
    })
}

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Proveedor.findById(id).exec((err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar la recarga',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'peticion realizada correctamente',
            proveedor: proveedor
        });
    });
})

app.post('/', (req, res) => {
    let proveedor = new Proveedor(req.body);

    proveedor.save((err, proveedorSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al guardar proveedor',
                errors: err
            });
        };

        res.status(200).json({
            ok: true,
            messaje: 'proveedor guardado correctamente',
            proveedor: proveedorSaved
        });

    })
})
app.put('/:id', (req, res) => {
    let proveedorNuevo = req.body
    let id = req.params.id;
    Proveedor.findById(id).exec((err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar proveedor',
                errors: err
            });
        };
        proveedor.nombre = proveedorNuevo.nombre
        proveedor.telefono = proveedorNuevo.telefono
        proveedor.comentario = proveedorNuevo.comentario
        proveedor.save((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messaje: 'Error al guardar proveedor',
                    errors: err
                });
            };
            res.status(200).json({
                ok: true,
                messaje: 'proveedor actualizado correctamente',
                proveedor: data
            })
        })
    })
})


app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Proveedor.findByIdAndRemove(id).exec((err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar proveedor',
                errors: err
            });
        };
        res.status(200).json({
            ok: true,
            messaje: 'Eliminacion realizada correctamente'
        });
    });
})
app.get('/buscar/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([buscarUsuarios(busqueda, regex)]).then(respuestas => {
        res.status(200).json({
            ok: true,
            proveedores: respuestas[0]
        });
    });
})

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Proveedor.find({})
            .or([{ 'nombre': regex }])
            .exec((err, proveedor) => {
                if (err) {
                    reject('Error al cargar proveedores', err)
                } else {
                    resolve(proveedor)
                }
            })
    })
}


module.exports = app