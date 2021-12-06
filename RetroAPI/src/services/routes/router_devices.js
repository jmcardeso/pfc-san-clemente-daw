// Router para los dispositivos. URL: /api/v1/devices

const { Router } = require('express');
const router = Router();

const {
    devicesGET,
    devicesPOST,
    devicesPUT,
    devicesDELETE,
} = require('./../../controller/devicesController');

router.get('/', devicesGET);
router.post('/', devicesPOST);
router.put('/', devicesPUT);
router.delete('/', devicesDELETE);

module.exports = router;