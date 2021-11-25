const express = require('express');

const { dbConnectionSync } = require('./../configs/config_db');
const { startLogger, logDebug, logInfo, logError }  = require('./../helpers/logger');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.WEB_SERVER_PORT;

        startLogger(this.app);

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();

        // Error Handling
        this.errors();
    }

    conectarDB() {
        dbConnectionSync()
            .then( msg => logInfo(msg))
            .catch(err => logError(err.message));
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
            logDebug("GET access from /");
        });

        // Mapping Path -> router
        this.app.use( "/api/v1/emulators",  require('./routes/router_emulators'));
    }

    errors(){
        this.app.use((req, res, next) => {
            res.status(400);

            res.json({msg: "RetroAPI - Bad request"});
            logError("The request is not well constructed");
        });
    }

    start(){
        this.app.listen(
            this.port,
            () => {
                logInfo(`RetroAPI - Server running and listening on port ${this.port}`);
            }
        )
    }
}

module.exports = Server;