const express = require('express');

const { dbConnectionSync } = require('./../configs/config_db');

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

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    conectarDB() {
        dbConnectionSync()
            .then( msg => this.logger.info(msg))
            .catch(err => this.logger.error(err.message));
        return this;
    }

    middlewares(){
        // Lectura y parseo del body de la request empleando json
        this.app.use( express.json() );
    }

    routes(){
        // Routes explícitas
        this.app.get('/', (req, res) => {
            res.status(202).json({msg:'RetroAPI, a free API to access retro hardware and software', status: true});
            this.logger.debug("GET access from /");
        });

        // Mapping Path -> router
        this.app.use( "/api/v1/emulators",  require('./routes/router_emulators'));
    }

    start(){
        this.app.listen(
            this.port,
            () => {
                this.logger.info(`RetroAPI - Server running and listening on port ${this.port}`);
            }
        )
    }
}

module.exports = Server;