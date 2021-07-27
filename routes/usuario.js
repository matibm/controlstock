var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middleware/autenticacion');

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error contando usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    totalUsuarios: conteo
                });
            })

        });
});

app.put('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        var body = req.body
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)'
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        })

    })

})

app.post('/', (req, res) => {
    var body = req.body

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            Usuarios: usuarioGuardado,
            usuarioToken: req.usuario
        })

    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: "no existe el usuario para borrar"
            });
        }

    })
})

app.get('/crear_usuario_admin', async(req, res )=>{
    let usuario = await new Usuario({
        
    nombre: 'admin',
    email: 'admin',
    password: bcrypt.hashSync('admin', 10),
     
    role: 'ADMIN_ROLE'
    }).save()

    res.status(200).json({
        ok:true, usuario: 'admin'
    })
})

module.exports = app;