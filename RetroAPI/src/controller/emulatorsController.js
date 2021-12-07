// Controlador para los emuladores

const Emulator = require('./../model/Emulator');
const Device = require('./../model/Device');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterEmulators } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');
const { Query } = require('mongoose');

// GET - Leer documentos de la colección 'emulators' de la BD
const emulatorsGET = async (req, res, next) => {
    try {
        // Almacenamos el idioma de la descripción y construimos el filtro para la búsqueda
        const { langFilter, emuFilter } = filterEmulators(req.query);

        // Buscamos en la BD, eliminando el _id del array de descripciones
        const [emulatorsRaw] = await Promise.all([
            Emulator.find(emuFilter, { 'description._id': 0 }),
        ]);

        logDebug("GET access from /api/v1/emulators");

        // Construimos el JSON que se mostrará en la salida
        const emulators = emulatorsJSON(emulatorsRaw, langFilter);
        res.status(200).json({
            emulators,
        });

        logDebug(emulators.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

// POST - Añadir un documento en la colección 'emulators' de la BD
const emulatorsPOST = async (req, res, next) => {
    try {
        const newEmulator = new Emulator(req.body);

        logDebug("POST access from /api/v1/emulators");

        // Si el usuario ha añadido una descripción, comprobamos que sea un array
        if (req.body.description) {
            if (!Array.isArray(req.body.description)) throw new RetroError('The description must be an array', 400);
        }

        // Si el nombre del emulador existe, lanzamos una excepción
        let emulatorExists = await Emulator.find({ 'name': newEmulator.name });
        if (emulatorExists.length == 1) throw new RetroError('The emulator already exists', 400);

        await newEmulator.save();

        logDebug("Operation succeed");

        res.status(201).json({
            "msg": "The new emulator has been saved successfully"
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

// PUT - Modificar un documento de la colección 'emulators' de la BD
const emulatorsPUT = async (req, res, next) => {
    try {
        // Desestructuramos para almacenar la descripción
        let { description, newName, ...updatedEmulator } = req.body;

        logDebug("PUT access from /api/v1/emulators");

        // Buscamos el documento en la BD
        let [emulatorBeforeUpdate] = await Emulator.find({ 'name': updatedEmulator.name });

        // Si no existe, error
        if (!emulatorBeforeUpdate) throw new RetroError('Emulator not found', 400);

        // Guardamos la id, por si hay que modificar el nombre
        const id = emulatorBeforeUpdate._id;

        // Convertimos la descripción del formato de MongoDB a un array normal
        let descriptionBeforeUpdate = JSON.parse(JSON.stringify(emulatorBeforeUpdate.description));

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
                    updatedEmulator.description = descriptionBeforeUpdate;

                    // Si no estaba el idioma que queremos añadir en el documento, lo añadimos ahora
                    if (!existsDescription) {
                        updatedEmulator.description.push(description[0]);
                    }

                    // Si no hay elementos en el array de descripciones del documento, añadimos la que pone el usuario sin más
                } else Object.assign(updatedEmulator, { 'description': [description[0]] });
            }
        }

         // Si se cambia el nombre, introducimos el nuevo en la propiedad 'name'
         if (newName) updatedEmulator.name = newName;

        // Realizamos la modificación en la BD
        const result = await Emulator.updateOne({ '_id': id }, updatedEmulator, { new: true });

        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Emulator successfully updated"
            });
        } else throw new RetroError("Emulator not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        logError(error.statusCode + ' - ' + error.message);

        if (error.name != 'RetroError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
    }
}

// Borrar un documento de la colección 'emulators' de la BD
const emulatorsDELETE = async (req, res, next) => {
    try {
        const { name } = req.body;

        logDebug("DELETE access from /api/v1/emulators");

        const emulator = await Emulator.findOne({ name });

        // Comprobamos que no exista ninguna referencia al emulador en la colección 'devices'
        if (emulator) {
            for await (const device of Device.find()) {
                for (const dv of device.emulators) {
                    if (dv.toString() == emulator.id) throw new RetroError("This emulator cannot be deleted, it is referenced in the Devices collection", 400);
                }
            }
        } else throw new RetroError("Game not found", 404);

        const result = await Emulator.deleteOne({ name });
        if (result) {
            logDebug("Operation succeed");
            res.status(200).json({
                "msg": "Emulator successfully deleted"
            });
        } else throw new RetroError("Emulator not found", 404);
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
 * Da formato a la búsqueda de la colección 'emulators'
 * @param {Query} emus - El array con los elementos encontrados
 * @param {String} lang - El idioma que se mostrará para la descripción
 * @returns {Array} El array formateado para el idioma especificado (inglés si no se ha indicado ninguno)
 */
const emulatorsJSON = (emus, lang) => {
    let emulators = new Array();
    let newElement;

    for (let emu of emus) {
        let { description, name, license, web, author } = emu;
        newElement = new Object();

        newElement.name = name;
        newElement.license = license ? license : '';
        newElement.web = web ? web : '';
        newElement.author = author ? author : '';
        newElement.description = new Array();

        if (description.length > 0) {
            for (let desc of description) {
                if (desc.lang == lang) {
                    newElement.description.push(desc);
                    break;
                }
            }
        }
        emulators.push(newElement);
    }

    return emulators;
}

module.exports = {
    emulatorsGET,
    emulatorsPOST,
    emulatorsPUT,
    emulatorsDELETE,
    emulatorsJSON,
}