const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError }  = require('./../helpers/logger');
const { filter } = require('./../helpers/filter');
const RetroError = require('./../services/routes/errors/retroError');

const emulatorsGET = async(req, res, next) => {
    try {
        const [emulators] = await Promise.all([
            Emulator.find(filter(req.query)),
        ]);

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

module.exports = {
    emulatorsGET,
}