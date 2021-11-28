// Inicializar variables de entorno (COMENTAR PARA DESPLIEGUE EN HEROKU)
//require('./configs/dotenv');

const Server = require('./services/WebServer');

// Inicialización REST Server
new Server().conectarDB().start();