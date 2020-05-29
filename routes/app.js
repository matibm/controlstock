var express = require('express');
var path = require('path')
var app = express()


app.use(express.static(`../dist/control-stock`));

//app.get('/*', (req, res) => res.sendFile(path.join(__dirname)))

// app.get('/', (req, res, next) => {
//     res.sendFile('../dist/index.html', { root: __dirname })
// })
module.exports = app