/*
==================== RetroAPI ====================
Proyecto de fin de ciclo DAW IES San Clemente 2021
       Autor: Juan Manuel Cardeso García
==================================================
*/

// Inicializar variables de entorno (si no estamos en producción)
if (process.env.NODE_ENV != 'production') require('./configs/dotenv');

const Server = require('./services/WebServer');

// Inicialización REST Server
new Server().conectarDB().start();