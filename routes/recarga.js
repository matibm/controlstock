var express = require('express');
var path = require('path')
var app = express()
var Recarga = require('../models/recarga');


app.get('/all', async(req, res) => {

    let recargas = await getRecargas()
    res.status(200).json({
        ok: true,
        messaje: 'Peticion realizada correctamente',
        recargas: recargas
    })
})


async function getRecargas() {
    return await Recarga.find({}, (err, recargas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar recargas',
                errors: err
            })
        }
        return recargas;
    })
}

app.get('/:id', (req, res) => {
    let id = req.params.id;
    Recarga.findById(id).exec((err, recarga) => {
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
            recarga: recarga
        });
    });
})

app.get('/filtro/:desde', async(req, res) => {
    var desde = req.params.desde || 0;
    var hasta = req.query.hasta || new Date().valueOf();

    desde = Number(desde);

    hasta = Number(hasta);
    let auxiliar = []
    let recargas = await getRecargas()
    console.log(recargas);
    for (let index = 0; index < recargas.length; index++) {
        const recarga = recargas[index];
        if (recarga.fecha >= desde && recarga.fecha <= hasta) {
            auxiliar.push(recarga);
        }
    }
    recargas = auxiliar;
    res.status(200).json({
        ok: true,
        messaje: 'Peticion realizada correctamente',
        recargas: recargas
    })

})

app.post('/', (req, res) => {
    let recarga = new Recarga(req.body);

    recarga.save((err, productoSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al guardar recarga',
                errors: err
            });
        };

        res.status(200).json({
            ok: true,
            messaje: 'recarga guardada correctamente',
            recarga: productoSaved
        });

    })
})

app.delete('/:id', (req, res) => {
    let id = req.params.id;
    Recarga.findByIdAndRemove(id).exec((err, recarga) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messaje: 'Error al buscar recarga',
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