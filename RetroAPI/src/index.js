// Inicializar variables de entorno
require('./configs/dotenv');

const Server = require('./services/WebServer');

// Inicialización REST Server
new Server().start();

// logger.debug('First message');

// console.log(logger);