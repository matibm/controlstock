var express = require('express');
var app = express();

var Medico = require('../models/medico');
var mdAutenticacion = require('../middleware/autenticacion');

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando medicos',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error contando medicos',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    medicos: medico,
                    total: conteo
                });
            })

        });
});

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findById(id, (err, medico) => {
        var body = req.body

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id,
            medico.hospital = body.hospital
        medico.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                Medico: hospitalGuardado
            });
        })
    })
})

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error cargando medico',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            Medico: medicoGuardado,
            usuarioToken: req.usuario
        })
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            medico: hospitalBorrado
        })
        if (!hospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: "no existe el medico para borrar"
            });
        }
    })
})


module.exports = app;