// Implementación del servicio GeometriaService.
// La estructura { Servicio: { Puerto: { Operacion } } } y los nombres de los
// elementos coinciden exactamente con los definidos en src/wsdl/geometria.wsdl.
const { aNumero, redondear } = require('./utils');

function leerRectangulo(args) {
  return {
    base: aNumero(args.base, 'base'),
    altura: aNumero(args.altura, 'altura'),
  };
}

function areaRectangulo(base, altura) {
  return redondear(base * altura);
}

function perimetroRectangulo(base, altura) {
  return redondear(2 * (base + altura));
}

const geometriaService = {
  GeometriaService: {
    GeometriaPort: {
      // Entrada: <AreaRectanguloRequest><base/><altura/></...>
      // Salida:  <AreaRectanguloResponse><area/></...>
      AreaRectangulo(args) {
        const { base, altura } = leerRectangulo(args);
        return { area: areaRectangulo(base, altura) };
      },
      // Entrada: <PerimetroRectanguloRequest><base/><altura/></...>
      // Salida:  <PerimetroRectanguloResponse><perimetro/></...>
      PerimetroRectangulo(args) {
        const { base, altura } = leerRectangulo(args);
        return { perimetro: perimetroRectangulo(base, altura) };
      },
    },
  },
};

module.exports = { geometriaService, areaRectangulo, perimetroRectangulo };
