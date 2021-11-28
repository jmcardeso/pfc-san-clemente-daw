const express = require('express');
const cors = require("cors");

const { dbConnectionSync } = require('./../configs/config_db');
const { startLogger, logDebug, logInfo, logError }  = require('./../helpers/logger');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT;

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
        // middleware para habilitar CORS
        this.app.use(cors());
        // Lectura y parseo del body de la request empleando JSON
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

        // Todas las URLs que no estén ruteadas por la aplicación devuelven un error 404
        this.app.get('*', function (req, res, next) {
            const error = new Error(
              `${req.ip} tried to access ${req.originalUrl}`,
            );
          
            error.statusCode = 404;
          
            next(error);
          });
    }

    errors(){
        this.app.use((error, req, res, next) => {
            if (!error.statusCode) error.statusCode = 500;

            if (error.statusCode === 404) {
              return res.status(404).json({msg:'RetroAPI - The server has not found anything matching the Request-URI'});
            }
          
            return res
              .status(error.statusCode)
              .json({ error: error.toString() });
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