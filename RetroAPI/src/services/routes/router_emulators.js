const { Router } = require('express');
const router = Router();

const {
    emulatorsGET,
} = require('./../../controller/emulatorsController');

router.get('/', emulatorsGET);

module.exports = router;