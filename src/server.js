// Punto de arranque: levanta el servidor HTTP con la aplicación configurada.
const app = require('./app');
const { PORT } = require('./config/config');

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
