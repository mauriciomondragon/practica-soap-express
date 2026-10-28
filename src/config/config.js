// Configuración general de la aplicación.
// El puerto se puede cambiar con la variable de entorno PORT.
const PORT = Number(process.env.PORT) || 3000;

module.exports = {
  PORT,
  // Prefijo donde se monta el Router de servicios SOAP
  SOAP_BASE_PATH: '/soap',
};
