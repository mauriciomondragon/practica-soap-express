// Router que registra los servicios SOAP.
// Cada servicio se publica con su implementación y su propio contrato WSDL.
// Rutas finales (montado en /soap):
//   /soap/conversiones        (WSDL en /soap/conversiones?wsdl)
//   /soap/geometria           (WSDL en /soap/geometria?wsdl)
const fs = require('fs');
const path = require('path');
const express = require('express');
const soap = require('soap');

const { conversionesService } = require('../services/conversiones.service');
const { geometriaService } = require('../services/geometria.service');

const router = express.Router();

const leerWsdl = (archivo) =>
  fs.readFileSync(path.join(__dirname, '..', 'wsdl', archivo), 'utf8');

const servicios = [
  { ruta: '/conversiones', implementacion: conversionesService, wsdl: leerWsdl('conversiones.wsdl') },
  { ruta: '/geometria', implementacion: geometriaService, wsdl: leerWsdl('geometria.wsdl') },
];

// soap.listen acepta cualquier objeto con route() y use(), por lo que se
// registra directamente sobre el Router y no sobre la aplicación principal.
servicios.forEach(({ ruta, implementacion, wsdl }) => {
  soap.listen(router, ruta, implementacion, wsdl);
});

module.exports = router;
