// Router para los juegos. URL: /api/v1/games

const { Router } = require('express');
const router = Router();

const {
    gamesGET,
    gamesPOST,
    gamesPUT,
    gamesDELETE,
} = require('./../../controller/gamesController');

router.get('/', gamesGET);
router.post('/', gamesPOST);
router.put('/', gamesPUT);
router.delete('/', gamesDELETE);

module.exports = router;