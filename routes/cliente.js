var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Cliente = require('../models/cliente');
var mdAutenticacion = require('../middleware/autenticacion');

app.get('/cumpleanero', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    let mesActual = new Date().getMonth();
    let diaActual = new Date().getDate();
    let cumpleaneros = []
    Cliente.find({})
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando clientes',
                    errors: err
                });
            }

            for (let i = 0; i < clientes.length; i++) {
                const cliente = clientes[i];
                let datecliente = new Date(cliente.fecha_nacimiento);
                if (datecliente.getMonth() == mesActual && datecliente.getDate() == diaActual) {
                    cumpleaneros.push(cliente)
                }
            }

            res.status(200).json({
                ok: true,
                haycumple: cumpleaneros.length > 0 ? true : false,
                clientes: cumpleaneros
            });

        });
});
app.get('/buscar/:termino', (req, res, next) => {
    var busqueda = req.params.termino;
    var regex = new RegExp(busqueda, 'i')
    Promise.all([buscarClientes(busqueda, regex)]).then(respuestas => {
        res.status(200).json({
            ok: true,
            clientes: respuestas[0]
        });
    });
})
app.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error al buscar cliente'
            })
        }
        if (cliente) {
            res.status(200).json({
                ok: true,
                cliente: cliente
            })
        }
    })

})

function buscarClientes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Cliente.find({})
            .or([{ 'ci': regex }, { 'nombre': regex }, { 'ci': regex }])
            .exec((err, cliente) => {
                if (err) {
                    reject('Error al cargar clientes', err)
                } else {
                    resolve(cliente)
                }
            })
    })
}


app.post('/', (req, res) => {
    // console.log(req.body)
    let cliente = new Cliente(req.body);
    cliente.save((err, clienteSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al cargar productos',
                errors: err
            });
        };

        res.status(200).json({
            ok: true,
            messaje: 'cliente guardado correctamente',
            cliente: cliente
        });

    })
})

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({})
        .skip(desde)
        .limit(20)
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando clientes',
                    errors: err
                });
            }

            Cliente.count({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error contando clientes',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    clientes: clientes,
                    totalClientes: conteo
                });
            })

        });
});



app.put('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findById(id, (err, cliente) => {
        var body = req.body

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar cliente',
                errors: err
            });
        }
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el' + id + 'no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }

        cliente.ci = body.ci;
        cliente.ruc = body.ruc;
        cliente.nombre = body.nombre;
        cliente.tel = body.tel;
        cliente.fecha_nacimiento = body.fecha_nacimiento;
        cliente.direccion = body.direccion;
        cliente.facturas = body.facturas;

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });

        })

    })

})


app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar cliente',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        })
        if (!clienteBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un cliente con ese id',
                errors: "no existe el cliente para borrar"
            });
        }

    })
})



module.exports = app;