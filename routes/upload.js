var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express()
app.use(fileUpload());


app.put('/', function(req, res) {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    // solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG', 'JPG', 'GIF', 'JPEG']

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extendiones validas son: ' + extensionesValidas.join() }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ new Date().getTime() }-${new Date().getMilliseconds() }.${ extensionArchivo}`;

    // Mover el archivo

    var path = `./uploads/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover el archivo',
                errors: err
            });
        }
        //    console.log('archivo subido correctamente');

        res.status(200).json({
            ok: true,
            messaje: 'Peticion realizada correctamente',
            nombreCortado: extensionArchivo,
            nombreArchivo: nombreArchivo
        })
    })

    //   subirImg(tipo, id, nombreArchivo, res);

    // res.status(200).json({
    //     ok: true,
    //     messaje: 'Peticion realizada correctamente',
    //     nombreCortado: extensionArchivo
    // })
});


function subirImg(nombreArchivo, res) {



    var pathViejo = './uploads/usuarios/' + usuario.img;
    if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
    }

    usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password = ':)'

        if (err) {
            res.status(500).json({
                ok: false,
                message: 'error al guaradar el archivo',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            messaje: 'Imag',
            nombreCortado: usuarioActualizado
        });
    });
}


module.exports = app