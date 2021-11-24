const Emulator = require('./../model/Emulator');
const { logDebug, logInfo, logError }  = require('./../helpers/logger');

const emulatorsGET = async(req, res) => {
    try {
        const {lang = "en", from = 0, limit = 25, name, license, description, author} = req.query;
        const [emulators] = await Promise.all([
            Emulator.find(),
        ]);

        let emuFilter = emulators.filter(emulator => emulator.author == "Autor 1");
        logDebug("GET access from /api/v1/emulators");

        res.json({
            emuFilter,
        });
    } catch (error) {
        res.json({
            "msg": error.message
        });
    }
}

module.exports = {
    emulatorsGET,
}