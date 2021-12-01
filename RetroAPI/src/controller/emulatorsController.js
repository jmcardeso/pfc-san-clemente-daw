const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError } = require('./../helpers/logger');
const { filterEmulators } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');

const emulatorsGET = async (req, res, next) => {
    try {
        let { lang } = req.query;
        if (lang == undefined) lang = 'en';
        const [emulators] = await Promise.all([
            Emulator.find(filterEmulators(req.query)),
        ]);

        let emuLang = new Array();
        let newElement;

        for (let emu of emulators) {
            let { description, name, license, web, author } = emu;
            newElement = new Object();

            newElement.name = name;
            newElement.license = license;
            newElement.web = web;
            newElement.author = author;

            // Poner lang en inglés si no existe el idioma
            if (typeof (description.lang) == 'string') {
                if (description.lang == lang) {
                    Object.assign(newElement, { 'description.lang': description.lang });
                    Object.assign(newElement, { 'description.content': description.content });
                }
            } else {
                for (let i = 0; i < description.lang.length; i++) {
                    if (description.lang[i] == lang) {
                        Object.assign(newElement, { 'description.lang': description.lang[i] });
                        Object.assign(newElement, { 'description.content': description.content[i] });
                    }
                }
            }
            emuLang.push(newElement);
        }

        logDebug("GET access from /api/v1/emulators");

        res.status(200).json({
            emuLang,
        });

        logDebug(emulators.length > 0 ? "Search succeed" : "Search not found");
    } catch (error) {
        res.status(400).json({
            "msg": "RetroAPI - Bad Request"
        });
        logError(error.message);
    }
}

module.exports = {
    emulatorsGET,
}