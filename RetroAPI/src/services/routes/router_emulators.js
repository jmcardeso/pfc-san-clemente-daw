// Router para los emuladores. URL: /api/v1/emulators

const { Router } = require('express');
const router = Router();

const {
    emulatorsGET,
    emulatorsPOST,
    emulatorsPUT,
    emulatorsDELETE,
} = require('./../../controller/emulatorsController');

router.get('/', emulatorsGET);
router.post('/', emulatorsPOST);
router.put('/', emulatorsPUT);
router.delete('/', emulatorsDELETE);

module.exports = router;