// Configuración de la aplicación Express.
// Este archivo solo aplica la configuración general (middleware) y monta el Router.
// No contiene la lógica de las operaciones ni la definición de los contratos WSDL.
const express = require('express');
const registroPeticiones = require('./middleware/registroPeticiones');
const soapRouter = require('./routes/soap.routes');
const { SOAP_BASE_PATH } = require('./config/config');

const app = express();

// 1. Middleware de registro: se ejecuta antes de las rutas SOAP.
//    Importante: no se usan parsers de cuerpo (express.json/text) porque la
//    biblioteca soap lee el XML directamente del flujo de la petición.
app.use(registroPeticiones);

// 2. Montaje del Router con los servicios SOAP.
app.use(SOAP_BASE_PATH, soapRouter);

app.get('/', (req, res) => {
  res.type('text/plain').send('Práctica SOAP con Express y WSDL. Servicios en /soap/conversiones y /soap/geometria');
});

module.exports = app;
