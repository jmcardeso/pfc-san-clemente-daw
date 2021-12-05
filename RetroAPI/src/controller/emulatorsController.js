const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterEmulators } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');
const { json } = require('express');

const emulatorsGET = async (req, res, next) => {
    try {
        const { langFilter, emuFilter } = filterEmulators(req.query);

        const [emulatorsRaw] = await Promise.all([
            Emulator.find(emuFilter),
        ]);

        logDebug("GET access from /api/v1/emulators");

        const emulators = emulatorsJSON(emulatorsRaw, langFilter);
        res.status(200).json({
            emulators,
        });

        logDebug(emulators.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name == 'CastError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

const emulatorsPOST = async (req, res, next) => {
    try {
        const newEmulator = new Emulator(req.body);

        let emulatorExists = await Emulator.find({ 'name': newEmulator.name });
        if (emulatorExists.length == 1) throw new RetroError('The emulator already exists', 400);
        else await newEmulator.save();

        res.status(201).json({
            "msg": "The new emulator has been saved successfully"
        });
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name == 'CastError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

const emulatorsPUT = async (req, res, next) => {
    try {
        let { description, ...updatedEmulator } = req.body;

        let [emulatorBeforeUpdate] = await Emulator.find({ 'name': updatedEmulator.name });

        if (!emulatorBeforeUpdate) throw new RetroError('Emulator not found', 400);

        let descriptionBeforeUpdate = JSON.parse(JSON.stringify(emulatorBeforeUpdate.description));

        if (description[0].content) {
            if (!description[0].lang) description[0].lang = 'en';

            if (Object.keys(descriptionBeforeUpdate).length > 0) {
                let existsDescription = false;
                for (element of descriptionBeforeUpdate) {
                    if (element.lang == description[0].lang) {
                        element.content = description[0].content;
                        existsDescription = true;
                        break;
                    }
                }
                updatedEmulator.description = descriptionBeforeUpdate;
                if (!existsDescription) {
                    updatedEmulator.description.push(description[0]);
                }
            } else Object.assign(updatedEmulator, { 'description': [description[0]] });
        }

        const result = await Emulator.updateOne({ 'name': updatedEmulator.name }, updatedEmulator, { new: true });

        if (result) {
            res.status(200).json({
                "msg": "Emulator successfully updated"
            });
        } else throw new RetroError("Emulator not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name == 'CastError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

const emulatorsDELETE = async (req, res, next) => {
    try {
        const { name } = req.body;
        const result = await Emulator.findOneAndDelete({ name });
        if (result) {
            res.status(200).json({
                "msg": "Emulator successfully deleted"
            });
        } else throw new RetroError("Emulator not found", 404);
    } catch (error) {
        if (error.statusCode == undefined) error.statusCode = 400;
        if (error.name == 'CastError') error.message = "Bad request";

        res.status(error.statusCode).json({
            "msg": error.message
        });
        logError(error.statusCode + ' - ' + error.message);
    }
}

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

        if (typeof (description.lang) == 'string') {
            if (description.lang == lang) {
                Object.assign(newElement, { 'description.lang': description.lang });
                Object.assign(newElement, { 'description.content': description.content });
            } else {
                Object.assign(newElement, { 'description.lang': '' });
                Object.assign(newElement, { 'description.content': '' });
            }
        } else if (typeof (description.lang) == 'object') {
            for (let i = 0; i < description.lang.length; i++) {
                if (description.lang[i] == lang) {
                    Object.assign(newElement, { 'description.lang': description.lang[i] });
                    Object.assign(newElement, { 'description.content': description.content[i] });
                    break;
                }
            }
        } else {
            Object.assign(newElement, { 'description.lang': '' });
            Object.assign(newElement, { 'description.content': '' });
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
}