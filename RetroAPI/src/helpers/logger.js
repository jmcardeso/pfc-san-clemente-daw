const express_logger = require('express-logger-unique-req-id');
let logger;

//logger configuration
const fileConf = {
    level: 'debug',
    filename: process.env.LOG_NAME,
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

const startLogger = (app) => {
    express_logger.initializeLogger(app, fileConf, consoleConf);
    logger = express_logger.getLogger();
}

const logInfo = (msg) => logger.info(msg);
const logError = (msg) => logger.error(msg);
const logDebug = (msg) => logger.debug(msg);

module.exports = {startLogger, logInfo, logError, logDebug};