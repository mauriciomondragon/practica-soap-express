# Conclusiones

SOAP sirve para que dos aplicaciones intercambien mensajes con una estructura fija, sin importar su lenguaje. El sobre XML (Envelope, Header y Body) separa claramente los datos de la operación de la información de control, y como cada elemento pertenece a un espacio de nombres, el servidor sabe exactamente qué operación se pide. En la práctica esto se notó cuando una petición con texto en lugar de número no regresó un error genérico, sino un `soap:Fault` con código y descripción.

WSDL es el contrato del servicio: describe los tipos de datos, los mensajes, las operaciones, el enlace con SOAP y la dirección del endpoint. Con él, otra persona puede saber qué enviar y qué recibirá sin leer el código y herramientas como SoapUI pueden generar las peticiones automáticamente. Por eso cuidé que los nombres del WSDL coincidieran exactamente con la implementación; si no coinciden, la biblioteca no encuentra la operación.

Consultar el contrato y llamar a una operación son cosas distintas. `GET /soap/conversiones?wsdl` solo devuelve la descripción del servicio y no ejecuta nada, mientras que un `POST` con un sobre XML y el encabezado `SOAPAction` sí ejecuta la lógica y devuelve un resultado, como los 77 °F o las 6.21371 millas obtenidas.

Separar las rutas en un Router permite que el archivo principal solo configure la aplicación. Agregar un tercer servicio solo implicaría modificar `soap.routes.js`, sin tocar `app.js`, lo que reduce el acoplamiento.

El middleware de registro se justifica porque medir método, URL, estado y tiempo es una responsabilidad transversal. Al ponerlo antes del Router se registraron por igual las consultas de WSDL y las cuatro invocaciones, sin repetir código en cada operación y sin alterar el XML.

SOAP con WSDL conviene, por ejemplo, en la integración entre un banco y una aseguradora, donde importan un contrato formal, la validación de tipos y estándares como WS-Security. En cambio, para una aplicación móvil que consulta un catálogo de productos, una API REST con JSON es más sencilla: mensajes más ligeros, menos configuración y consumo directo desde JavaScript.
