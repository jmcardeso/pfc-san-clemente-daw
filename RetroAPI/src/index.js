// Inicializar variables de entorno
//require('./configs/dotenv');

const Server = require('./services/WebServer');

// Inicialización REST Server
new Server().conectarDB().start();