// Controlador para los juegos

const Game = require('./../model/Game');
const Device = require('./../model/Device');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterGames } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');
const { Query } = require('mongoose');

// GET - Leer documentos de la colección 'games' de la BD
const gamesGET = async (req, res, next) => {
    try {
        // Almacenamos el idioma de la descripción y construimos el filtro para la búsqueda
        const { langFilter, gameFilter } = filterGames(req.query);

        // Buscamos en la BD, eliminando el _id del array de descripciones
        const [gamesRaw] = await Promise.all([
            Game.find(gameFilter, { 'description._id': 0 }),
        ]);

        logDebug("GET access from /api/v1/games");

        // Construimos el JSON que se mostrará en la salida
        const games = gamesJSON(gamesRaw, langFilter);
        res.status(200).json({
            games,
        });

        logDebug(games.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

// POST - Añadir un documento en la colección 'games' de la BD
const gamesPOST = async (req, res, next) => {
    try {
        const newGame = new Game(req.body);

        logDebug("POST access from /api/v1/games");

        // Si el usuario ha añadido una descripción, comprobamos que sea un array
        if (req.body.description) {
            if (!Array.isArray(req.body.description)) throw new RetroError('The description must be an array', 400);
        }

        // Si el nombre del juego existe, lanzamos una excepción
        let gameExists = await Game.find({ 'name': newGame.name });
        if (gameExists.length == 1) throw new RetroError('The game already exists', 400);

        await newGame.save();

        logDebug("Operation succeed");

        res.status(201).json({
            "msg": "The new game has been saved successfully"
        });
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

// PUT - Modificar un documento de la colección 'games' de la BD
const gamesPUT = async (req, res, next) => {
    try {
        // Desestructuramos para almacenar la descripción
        let { description, newName, ...updatedGame } = req.body;

        logDebug("PUT access from /api/v1/games");

        // Buscamos el documento en la BD
        let [gameBeforeUpdate] = await Game.find({ 'name': updatedGame.name });

        // Si no existe, error
        if (!gameBeforeUpdate) throw new RetroError('Game not found', 400);

        // Guardamos la id, por si hay que modificar el nombre
        const id = gameBeforeUpdate._id;

        // Convertimos la descripción del formato de MongoDB a un array normal
        let descriptionBeforeUpdate = JSON.parse(JSON.stringify(gameBeforeUpdate.description));

        // Comprobamos que el usuario añadió la descripción en forma de array
        if (description) {
            if (!Array.isArray(description)) throw new RetroError('The description must be an array', 400);

            // Si el usuario añadió contenido para modificar...
            if (description[0].content) {
                // ... comprobamos si tiene idioma, sino se pone inglés por defecto
                if (!description[0].lang) description[0].lang = 'en';

                // Si hay elementos en el array de descripción del documento que se va a modificar...
                if (Object.keys(descriptionBeforeUpdate).length > 0) {
                    let existsDescription = false;

                    // ...recorremos el array para ver si el idioma ya está incluído. Si lo está, modificamos su contenido
                    for (element of descriptionBeforeUpdate) {
                        if (element.lang == description[0].lang) {
                            element.content = description[0].content;
                            existsDescription = true;
                            break;
                        }
                    }

                    // Añadimos el array de descripciones anterior a la modificación en el documento modificado (para que no se eliminen) 
                    updatedGame.description = descriptionBeforeUpdate;

                    // Si no estaba el idioma que queremos añadir en el documento, lo añadimos ahora
                    if (!existsDescription) {
                        updatedGame.description.push(description[0]);
                    }

                    // Si no hay elementos en el array de descripciones del documento, añadimos la que pone el usuario sin más
                } else Object.assign(updatedGame, { 'description': [description[0]] });
            }
        }

        // Si se cambia el nombre, introducimos el nuevo en la propiedad 'name'
        if (newName) updatedGame.name = newName;

        // Realizamos la modificación en la BD
        const result = await Game.updateOne({ '_id': id }, updatedGame, { new: true });

        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Game successfully updated"
            });
        } else throw new RetroError("Game not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

// Borrar un documento de la colección 'games' de la BD
const gamesDELETE = async (req, res, next) => {
    try {
        const { name } = req.body;

        logDebug("DELETE access from /api/v1/games");

        const game = await Game.findOne({ name });

        // Comprobamos que no exista ninguna referencia al juego en la colección 'devices'
        if (game) {
            for await (const device of Device.find()) {
                for (const gm of device.games) {
                    if (gm.toString() == game.id) throw new RetroError("This game cannot be deleted, it is referenced in the Devices collection", 400);
                }
            }
        } else throw new RetroError("Game not found", 404);

        const result = await Game.deleteOne({ name });
        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Game successfully deleted"
            });
        } else throw new RetroError("Error deleting game", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

/**
 * Da formato a la búsqueda de la colección 'games'
 * @param {Query} gms - El array con los elementos encontrados
 * @param {String} lang - El idioma que se mostrará para la descripción
 * @returns {Array} El array formateado para el idioma especificado (inglés si no se ha indicado ninguno)
 */
const gamesJSON = (gms, lang) => {
    let games = new Array();
    let newElement;

    for (let gm of gms) {
        let { description, name, studio, year, genre, image } = gm;
        newElement = new Object();

        newElement.name = name;
        newElement.studio = studio ? studio : '';
        newElement.year = year ? year : '';
        newElement.genre = genre ? genre : '';
        newElement.image = image ? image : '';
        newElement.description = new Array();

        if (description.length > 0) {
            for (let desc of description) {
                if (desc.lang == lang) {
                    newElement.description.push(desc);
                    break;
                }
            }
        }
        games.push(newElement);
    }

    return games;
}

module.exports = {
    gamesGET,
    gamesPOST,
    gamesPUT,
    gamesDELETE,
    gamesJSON,
}