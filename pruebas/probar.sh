#!/usr/bin/env bash
# Ejecuta las cuatro pruebas SOAP con curl y guarda cada respuesta XML
# en pruebas/respuestas/. Requiere que el servidor esté corriendo (npm start).
# Uso: bash pruebas/probar.sh   (desde la raíz del proyecto)

BASE_URL="${BASE_URL:-http://localhost:3000}"
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DIR/respuestas"

probar() {
  local endpoint="$1" accion="$2" archivo="$3"
  echo "=== $accion ($endpoint) ==="
  curl -s -X POST "$BASE_URL$endpoint" \
    -H "Content-Type: text/xml; charset=utf-8" \
    -H "SOAPAction: \"$accion\"" \
    --data-binary "@$DIR/peticiones/$archivo" \
    -o "$DIR/respuestas/$archivo" \
    -w "HTTP %{http_code}\n"
  cat "$DIR/respuestas/$archivo"; echo; echo
}

probar /soap/conversiones http://practica.soap/conversiones/CelsiusAFahrenheit celsius-a-fahrenheit.xml
probar /soap/conversiones http://practica.soap/conversiones/KilometrosAMillas  kilometros-a-millas.xml
probar /soap/geometria    http://practica.soap/geometria/AreaRectangulo         area-rectangulo.xml
probar /soap/geometria    http://practica.soap/geometria/PerimetroRectangulo    perimetro-rectangulo.xml
