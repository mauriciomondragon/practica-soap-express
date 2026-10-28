// Implementación del servicio ConversionesService.
// La estructura { Servicio: { Puerto: { Operacion } } } y los nombres de los
// elementos coinciden exactamente con los definidos en src/wsdl/conversiones.wsdl.
const { aNumero, redondear } = require('./utils');

const FACTOR_KM_A_MILLAS = 0.621371;

function celsiusAFahrenheit(celsius) {
  return redondear((celsius * 9) / 5 + 32);
}

function kilometrosAMillas(kilometros) {
  return redondear(kilometros * FACTOR_KM_A_MILLAS);
}

const conversionesService = {
  ConversionesService: {
    ConversionesPort: {
      // Entrada: <CelsiusAFahrenheitRequest><celsius/></...>
      // Salida:  <CelsiusAFahrenheitResponse><fahrenheit/></...>
      CelsiusAFahrenheit(args) {
        const celsius = aNumero(args.celsius, 'celsius');
        return { fahrenheit: celsiusAFahrenheit(celsius) };
      },
      // Entrada: <KilometrosAMillasRequest><kilometros/></...>
      // Salida:  <KilometrosAMillasResponse><millas/></...>
      KilometrosAMillas(args) {
        const kilometros = aNumero(args.kilometros, 'kilometros');
        return { millas: kilometrosAMillas(kilometros) };
      },
    },
  },
};

module.exports = { conversionesService, celsiusAFahrenheit, kilometrosAMillas };
