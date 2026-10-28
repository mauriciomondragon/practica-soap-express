// Configuración de la aplicación Express.
// Este archivo solo aplica la configuración general (middleware) y monta el Router.
// No contiene la lógica de las operaciones ni la definición de los contratos WSDL.
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.type('text/plain').send('Práctica SOAP con Express y WSDL. Servicios en /soap/conversiones y /soap/geometria');
});

module.exports = app;
