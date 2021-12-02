const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterEmulators } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');

const emulatorsGET = async (req, res, next) => {
    try {
        let { lang } = req.query;
        if (lang == undefined) lang = 'en';

        const emuFilter = filterEmulators(req.query);
        //if (Object.keys(emuFilter).length == 0) throw (new RetroError("RetroAPI - Not such parameter", 400));

        const [emulatorsRaw] = await Promise.all([
            Emulator.find(emuFilter),
        ]);

        let emulators = new Array();
        let newElement;

        for (let emu of emulatorsRaw) {
            let { description, name, license, web, author } = emu;
            newElement = new Object();

            newElement.name = name;
            newElement.license = license;
            newElement.web = web;
            newElement.author = author;

            if (typeof (description.lang) == 'string') {
                if (description.lang == lang) {
                    Object.assign(newElement, { 'description.lang': description.lang });
                    Object.assign(newElement, { 'description.content': description.content });
                } else {
                    Object.assign(newElement, { 'description.lang': ""});
                    Object.assign(newElement, { 'description.content': ""});
                }
            } else if (typeof (description.lang) == 'object') {
                for (let i = 0; i < description.lang.length; i++) {
                    if (description.lang[i] == lang) {
                        Object.assign(newElement, { 'description.lang': description.lang[i] });
                        Object.assign(newElement, { 'description.content': description.content[i] });
                    } else {
                        Object.assign(newElement, { 'description.lang': ""});
                        Object.assign(newElement, { 'description.content': ""});
                    }
                }
            }
            emulators.push(newElement);
        }

        logDebug("GET access from /api/v1/emulators");

        res.status(200).json({
            emulators,
        });

        logDebug(emulators.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        res.status(400).json({
            "msg": "RetroAPI - Bad Request"
        });
        logError(error.message);
    }
}

const emulatorsPOST = async (req, res, next) => {
    try {
        const newEmulator = new Emulator(req.body);
        await newEmulator.save();

        res.status(201).json({
            "msg": "RetroAPI - The new emulator has been saved successfully" 
        });
    } catch(error) {
        res.status(400).json({
            "msg": "RetroAPI - Emulator validation failed: name is required."
        });
        logError(error.message);
    }
}

const emulatorsPUT = async (req, res, next) => {
    try {

    } catch(error) {

    }
}

const emulatorsDELETE = async (req, res, next) => {
    try {

    } catch(error) {

    }
}

module.exports = {
    emulatorsGET,
    emulatorsPOST,
    emulatorsPUT,
    emulatorsDELETE,
}