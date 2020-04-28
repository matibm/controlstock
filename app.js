// Requires
var express = require('express');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var bodyParser = require('body-parser');

// Inicializar variables 
var app = express();
var cors = require('cors');

// CORS 
/*
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*"); // "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*"); // "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//body porser
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// 'mongodb://localhost:27017/portafolio'
// Conexion a la base de datos


// Importar Rutas 
var appRoutes = require('./routes/app');
var productoRoutes = require('./routes/producto');
var facturaRoutes = require('./routes/factura');
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var uploadRoutes = require('./routes/upload');
var egresoRoutes = require('./routes/egreso');
var cierreCajaRoutes = require('./routes/cierreCaja');
var imagenesRoutes = require('./routes/imagenes');
var busquedaRoutes = require('./routes/busqueda');
// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/egreso', egresoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/factura', facturaRoutes);
app.use('/producto', productoRoutes);
app.use('/cierrecaja', cierreCajaRoutes);
app.use('/', appRoutes);

mongoose.connection.openUri('mongodb://localhost:27017/Productos', (err, res) => {
        if (err) throw err;
        console.log("Base de datos:  \x1b[32m%s\x1b[0m", ' online');
    })
    // Escuchar peticiones 
app.listen(3000, () => {
    console.log('Servidor funcionando en puerto 3000: \x1b[32m%s\x1b[0m', ' online');

})