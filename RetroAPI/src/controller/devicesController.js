// Controlador para los dispositivos

const Device = require('./../model/Device');
const Emulator = require('./../model/Emulator');
const Game = require('./../model/Game');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterDevices } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');
const { Query } = require('mongoose');
const { emulatorsJSON } = require('./emulatorsController');
const { gamesJSON } = require('./gamesController');

// GET - Leer documentos de la colección 'devices' de la BD
const devicesGET = async (req, res, next) => {
    try {
        // Almacenamos el idioma de la descripción y construimos el filtro para la búsqueda
        const { langFilter, deviceFilter } = filterDevices(req.query);

        // Buscamos en la BD, eliminando el _id del array de descripciones de cada colección
        const [devicesRaw] = await Promise.all([
            Device.find(deviceFilter, { 'description._id': 0 }).
                populate({ path: 'games', select: { 'description._id': 0 } }).
                populate({ path: 'emulators', select: { 'description._id': 0 } }),
        ]);

        logDebug("GET access from /api/v1/devices");

        // Construimos el JSON que se mostrará en la salida
        const devices = devicesJSON(devicesRaw, langFilter);
        res.status(200).json({
            devices,
        });

        logDebug(devices.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

// POST - Añadir un documento en la colección 'devices' de la BD
const devicesPOST = async (req, res, next) => {
    try {
        const { games, emulators, ...rest } = req.body;
        const newDevice = new Device(rest);

        logDebug("POST access from /api/v1/devices");

        if (games) {
            for (let element of games) {
                const [game] = await Promise.all([
                    Game.findOne({ name: element }),
                ]);
                if (game) newDevice.games.push(game._id);
            }
        }

        if (emulators) {
            for (let element of emulators) {
                const [emulator] = await Promise.all([
                    Emulator.findOne({ name: element }),
                ]);
                if (emulator) newDevice.emulators.push(emulator._id);
            }
        }

        // Si el usuario ha añadido una descripción, comprobamos que sea un array
        if (req.body.description) {
            if (!Array.isArray(req.body.description)) throw new RetroError('The description must be an array', 400);
        }

        // Si el nombre del juego existe, lanzamos una excepción
        let deviceExists = await Device.find({ 'name': newDevice.name });
        if (deviceExists.length == 1) throw new RetroError('The device already exists', 400);

        await newDevice.save();

        logDebug("Operation succeed");

        res.status(201).json({
            "msg": "The new device has been saved successfully"
        });
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

// PUT - Modificar un documento de la colección 'devices' de la BD
const devicesPUT = async (req, res, next) => {
    try {
        // Desestructuramos para almacenar la descripción
        let { description, games, emulators, newName, ...updatedDevice } = req.body;

        logDebug("PUT access from /api/v1/devices");

        // Buscamos el documento en la BD
        let [deviceBeforeUpdate] = await Device.find({ 'name': updatedDevice.name });

        // Si no existe, error
        if (!deviceBeforeUpdate) throw new RetroError('Device not found', 400);

        // Guardamos la id, por si hay que modificar el nombre
        const id = deviceBeforeUpdate._id;

        // Convertimos la descripción del formato de MongoDB a un array normal
        let descriptionBeforeUpdate = JSON.parse(JSON.stringify(deviceBeforeUpdate.description));

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
                    updatedDevice.description = descriptionBeforeUpdate;

                    // Si no estaba el idioma que queremos añadir en el documento, lo añadimos ahora
                    if (!existsDescription) {
                        updatedDevice.description.push(description[0]);
                    }

                    // Si no hay elementos en el array de descripciones del documento, añadimos la que pone el usuario sin más
                } else Object.assign(updatedDevice, { 'description': [description[0]] });
            }
        }

        // Si se cambia el nombre, introducimos el nuevo en la propiedad 'name'
        if (newName) updatedDevice.name = newName;

        // Realizamos la modificación en la BD
        const result = await Device.updateOne({ '_id': id }, updatedDevice, { new: true });

        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Device successfully updated"
            });
        } else throw new RetroError("Device not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

// Borrar un documento de la colección 'devices' de la BD
const devicesDELETE = async (req, res, next) => {
    try {
        const { name } = req.body;

        logDebug("DELETE access from /api/v1/devices");

        const result = await Device.findOneAndDelete({ name });
        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Device successfully deleted"
            });
        } else throw new RetroError("Device not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

/**
 * Da formato a la búsqueda de la colección 'devices'
 * @param {Query} dvcs - El array con los elementos encontrados
 * @param {String} lang - El idioma que se mostrará para la descripción
 * @returns {Array} El array formateado para el idioma especificado (inglés si no se ha indicado ninguno)
 */
const devicesJSON = (dvcs, lang) => {
    let devices = new Array();
    let newElement;

    for (let dv of dvcs) {
        let { description, name, manufacturer, year, architecture, image, cpu, memory, type, gamepad, games, emulators } = dv;
        newElement = new Object();

        newElement.name = name;
        newElement.manufacturer = manufacturer ? manufacturer : '';
        newElement.year = year ? year : '';
        newElement.architecture = architecture ? architecture : '';
        newElement.cpu = cpu ? cpu : '';
        newElement.memory = memory ? memory : '';
        newElement.type = type ? type : '';
        newElement.gamepad = gamepad ? gamepad : '';
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

        newElement.games = games ? gamesJSON(games, lang) : '';
        newElement.emulators = emulators ? emulatorsJSON(emulators, lang) : '';

        devices.push(newElement);
    }

    return devices;
}

module.exports = {
    devicesGET,
    devicesPOST,
    devicesPUT,
    devicesDELETE,
}