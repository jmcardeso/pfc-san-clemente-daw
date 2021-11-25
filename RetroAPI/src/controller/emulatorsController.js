const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError }  = require('./../helpers/logger');
const { filter } = require('./../helpers/filter');

const emulatorsGET = async(req, res) => {
    try {
        const [emulators] = await Promise.all([
            Emulator.find(filter(req.query)),
        ]);

        logDebug("GET access from /api/v1/emulators");

        res.json({
            emulators,
        });
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