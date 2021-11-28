// Inicializar variables de entorno (si no estamos en producción)
if (process.env.NODE_ENV != 'production') require('./configs/dotenv');

const Server = require('./services/WebServer');

// Inicialización REST Server
new Server().conectarDB().start();