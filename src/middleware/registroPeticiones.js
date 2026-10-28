// Middleware de registro de peticiones.
// Mide el tiempo desde que llega la petición hasta que la respuesta termina de
// enviarse y escribe una línea con método, URL, código de estado y duración.
// Solo escucha el evento 'finish' de la respuesta: no lee ni modifica el cuerpo
// XML de la petición ni de la respuesta.
function registroPeticiones(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on('finish', () => {
    const duracionMs = Number(process.hrtime.bigint() - inicio) / 1e6;
    const fecha = new Date().toISOString();
    console.log(
      `[${fecha}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracionMs.toFixed(2)} ms)`
    );
  });

  next();
}

module.exports = registroPeticiones;
