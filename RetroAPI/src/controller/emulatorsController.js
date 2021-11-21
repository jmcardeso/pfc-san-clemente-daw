const Emulator = require('./../model/Emulator');

const emulatorsGET = async(req, res) => {
    try {
        const [emulators] = await Promise.all([
            Emulator.find(),
        ]);

        res.json({
            emulators,
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