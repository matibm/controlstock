var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Sucursal = require('../models/sucursal');


app.get('/sucursales', async (req, res) => {
    try {
        let sucursales = await Sucursal.find()
        res.status(200).json({
            ok: true, sucursales
        })
    } catch (error) {
        res.status(500).json({
            ok: true, error: error.message
        })
    }

})
app.post('/crear_sucursal', async (req, res) => {
    try {
        let body = req.body
        if (!body) throw new Error('body es requerido')
        let sucursal = await new Sucursal(body).save()

        res.status(200).json({
            ok: true, sucursal
        })
    } catch (error) {
        res.status(500).json({
            ok: true, error: error.message
        })
    }

})

module.exports = app;
