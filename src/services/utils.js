// Utilidades compartidas por los servicios SOAP.

// Convierte un valor recibido en el XML a número. Si no es válido,
// lanza un SOAP Fault (la biblioteca `soap` lo serializa como <soap:Fault>).
function aNumero(valor, nombreCampo) {
  const numero = Number(valor);
  if (valor === undefined || valor === null || valor === '' || Number.isNaN(numero)) {
    throw {
      Fault: {
        faultcode: 'soap:Client',
        faultstring: `El campo "${nombreCampo}" es obligatorio y debe ser numérico.`,
        statusCode: 400,
      },
    };
  }
  return numero;
}

// Redondea para evitar residuos de punto flotante (p. ej. 6.2137100000000004)
function redondear(valor, decimales = 6) {
  return Number(valor.toFixed(decimales));
}

module.exports = { aNumero, redondear };
