const express = require('express');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.WEB_SERVER_PORT;

        this.express_logger = require('express-logger-unique-req-id');

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

        this.express_logger.initializeLogger(this.app, fileConf, consoleConf);
        this.logger = this.express_logger.getLogger();
    }

    start(){
        this.app.listen(
            this.port,
            () => {
                this.logger.debug(`RetroAPI - Server running and listening on port ${this.port}`);
            }
        )
    }
}

module.exports = Server;