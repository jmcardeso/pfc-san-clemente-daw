var express= require('express');
var app = express();

var express_logger = require('express-logger-unique-req-id');

//logger configuration
const fileConf = {
    level: 'debug',
    filename: './RetroAPI/logs.log', // Poner en variable entorno para modificar en PRD
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true
};

const consoleConf = {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true
};

express_logger.initializeLogger(app, fileConf, consoleConf);
let logger = express_logger.getLogger();

logger.debug('First message');