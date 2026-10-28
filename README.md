# Práctica: Servicios web SOAP con Express y WSDL

Aplicación en Node.js y Express que expone dos servicios web SOAP (`ConversionesService` y `GeometriaService`). Cada servicio tiene su propio contrato WSDL, ofrece dos operaciones, recibe peticiones SOAP en XML y responde con sobres SOAP en XML. Los servicios se registran desde un Router de Express y un middleware registra todas las peticiones.

**Autor:** Mauricio Israel Mondragón Chávez

## Requisitos

- Node.js 18 o superior (probado con Node.js 22)
- npm
- curl (o Postman / SoapUI) para enviar las peticiones de prueba
- Git, para clonar el repositorio

## Instalación

```bash
git clone <URL-del-repositorio>
cd practica-soap-express
npm install
```

Dependencias: `express` (servidor web) y `soap` (servidor SOAP y publicación del WSDL).

## Ejecución

```bash
npm start
```

El servidor queda en `http://localhost:3000`. Para usar otro puerto: `PORT=4000 npm start` (ver `.env.example`). Si cambias el puerto, actualiza también `soap:address` en los dos archivos de `src/wsdl/`.

## Estructura del proyecto

```
practica-soap-express/
├── src/
│   ├── server.js                      # Arranque: levanta el servidor HTTP
│   ├── app.js                         # Configuración de Express: middleware + montaje del Router
│   ├── config/config.js               # Puerto y prefijo /soap
│   ├── routes/soap.routes.js          # Router que registra los dos servicios SOAP
│   ├── middleware/registroPeticiones.js  # Middleware de registro (método, URL, estado, tiempo)
│   ├── services/
│   │   ├── conversiones.service.js    # Lógica de CelsiusAFahrenheit y KilometrosAMillas
│   │   ├── geometria.service.js       # Lógica de AreaRectangulo y PerimetroRectangulo
│   │   └── utils.js                   # Validación numérica (SOAP Fault) y redondeo
│   └── wsdl/
│       ├── conversiones.wsdl          # Contrato de ConversionesService
│       └── geometria.wsdl             # Contrato de GeometriaService
├── pruebas/
│   ├── peticiones/                    # Las 4 peticiones SOAP (XML)
│   ├── respuestas/                    # Las 4 respuestas SOAP obtenidas (XML)
│   └── probar.sh                      # Script que envía las 4 peticiones con curl
├── evidencias/                        # Capturas de los WSDL, respuestas y registro del middleware
├── CONCLUSIONES.md
├── .env.example
├── .gitignore
└── package.json
```

`app.js` no contiene lógica de operaciones ni contratos: solo aplica el middleware y monta el Router en `/soap`.

## Endpoints y contratos WSDL

| Servicio | Endpoint SOAP (POST) | Contrato WSDL (GET) | Operaciones |
|---|---|---|---|
| ConversionesService | `http://localhost:3000/soap/conversiones` | `http://localhost:3000/soap/conversiones?wsdl` | CelsiusAFahrenheit, KilometrosAMillas |
| GeometriaService | `http://localhost:3000/soap/geometria` | `http://localhost:3000/soap/geometria?wsdl` | AreaRectangulo, PerimetroRectangulo |

Detalle de cada operación (estilo document/literal, SOAP 1.1):

| Operación | SOAPAction | Elemento de entrada | Elemento de salida |
|---|---|---|---|
| CelsiusAFahrenheit | `http://practica.soap/conversiones/CelsiusAFahrenheit` | `CelsiusAFahrenheitRequest` (`celsius`: double) | `CelsiusAFahrenheitResponse` (`fahrenheit`: double) |
| KilometrosAMillas | `http://practica.soap/conversiones/KilometrosAMillas` | `KilometrosAMillasRequest` (`kilometros`: double) | `KilometrosAMillasResponse` (`millas`: double) |
| AreaRectangulo | `http://practica.soap/geometria/AreaRectangulo` | `AreaRectanguloRequest` (`base`, `altura`: double) | `AreaRectanguloResponse` (`area`: double) |
| PerimetroRectangulo | `http://practica.soap/geometria/PerimetroRectangulo` | `PerimetroRectanguloRequest` (`base`, `altura`: double) | `PerimetroRectanguloResponse` (`perimetro`: double) |

Si un valor no es numérico, el servicio responde con un `soap:Fault` (HTTP 400) en lugar de un resultado.

## Pruebas

Con el servidor corriendo (`npm start`), en otra terminal:

### 1. Consultar los contratos

Abre en el navegador (o con curl) las dos direcciones; cada una muestra sus dos operaciones y su propio `soap:address`:

```bash
curl "http://localhost:3000/soap/conversiones?wsdl"
curl "http://localhost:3000/soap/geometria?wsdl"
```

### 2. Invocar las operaciones

Opción A, todas a la vez (guarda las respuestas en `pruebas/respuestas/`):

```bash
bash pruebas/probar.sh
```

Opción B, una por una con curl (desde la raíz del proyecto):

```bash
# CelsiusAFahrenheit: 25 °C -> 77
curl -X POST http://localhost:3000/soap/conversiones \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://practica.soap/conversiones/CelsiusAFahrenheit"' \
  --data-binary @pruebas/peticiones/celsius-a-fahrenheit.xml

# KilometrosAMillas: 10 km -> 6.21371
curl -X POST http://localhost:3000/soap/conversiones \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://practica.soap/conversiones/KilometrosAMillas"' \
  --data-binary @pruebas/peticiones/kilometros-a-millas.xml

# AreaRectangulo: base 8, altura 5 -> 40
curl -X POST http://localhost:3000/soap/geometria \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://practica.soap/geometria/AreaRectangulo"' \
  --data-binary @pruebas/peticiones/area-rectangulo.xml

# PerimetroRectangulo: base 8, altura 5 -> 26
curl -X POST http://localhost:3000/soap/geometria \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://practica.soap/geometria/PerimetroRectangulo"' \
  --data-binary @pruebas/peticiones/perimetro-rectangulo.xml
```

En Windows (PowerShell) usa `curl.exe` en lugar de `curl`. En Postman o SoapUI: método POST, la URL del endpoint, los encabezados `Content-Type: text/xml` y `SOAPAction`, y como cuerpo (raw) el contenido del archivo XML correspondiente.

### Resultados obtenidos

| Operación | Caso de prueba | Esperado | Obtenido | Respuesta guardada |
|---|---|---|---|---|
| CelsiusAFahrenheit | 25 °C | 77 | `<fahrenheit>77</fahrenheit>` | `pruebas/respuestas/celsius-a-fahrenheit.xml` |
| KilometrosAMillas | 10 km | 6.21371 | `<millas>6.21371</millas>` | `pruebas/respuestas/kilometros-a-millas.xml` |
| AreaRectangulo | base 8, altura 5 | 40 | `<area>40</area>` | `pruebas/respuestas/area-rectangulo.xml` |
| PerimetroRectangulo | base 8, altura 5 | 26 | `<perimetro>26</perimetro>` | `pruebas/respuestas/perimetro-rectangulo.xml` |

Las cuatro respuestas conservan el formato SOAP (`soap:Envelope` / `soap:Body`) en XML.

### 3. Registro del middleware

Mientras corren las pruebas, la terminal de `npm start` muestra una línea por petición, por ejemplo:

```
[2026-10-28T01:38:09.586Z] GET /soap/conversiones?wsdl -> 200 (4.40 ms)
[2026-10-28T01:38:09.613Z] POST /soap/conversiones -> 200 (4.57 ms)
```

El middleware se aplica antes del Router, por lo que registra tanto las consultas de WSDL como las invocaciones, y solo escucha el evento `finish` de la respuesta, sin leer ni modificar el XML.

## Evidencias

| Archivo | Contenido |
|---|---|
| `evidencias/wsdl-conversiones.png` | Captura del contrato `/soap/conversiones?wsdl` en el navegador |
| `evidencias/wsdl-geometria.png` | Captura del contrato `/soap/geometria?wsdl` en el navegador |
| `evidencias/respuestas-soap.png` | Captura de las cuatro respuestas SOAP |
| `evidencias/salida-pruebas.txt` | Salida de texto de `pruebas/probar.sh` |
| `evidencias/registro-middleware.png` | Captura del registro generado por el middleware |
| `evidencias/registro-middleware.txt` | Registro del middleware en texto |

## Conclusiones

Ver [CONCLUSIONES.md](CONCLUSIONES.md).
