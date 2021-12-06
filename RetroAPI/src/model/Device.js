const mongoose = require('mongoose');
const Game = require('./Game');
const GameSchema = mongoose.model('Game').schema;
const Emulator = require('./Emulator');
const EmulatorSchema = mongoose.model('Emulator').schema;
const Schema = mongoose.Schema;

const DeviceSchema = Schema({
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: false },
    architecture: { type: String, required: false },
    cpu: { type: String, required: false },
    memory: { type: String, required: false },
    type: { type: String , required: false },
    gamepad: { type: String, required: false },
    year: { type: Number, required: false },
    description: [{
        lang: { type: String, required: false },
        content: { type: String, required: false }
    }],
    image: {type: [String], required: false },
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
    emulators: [{type: Schema.Types.ObjectId, ref: 'Emulator'}]
});

module.exports = mongoose.model('Device', DeviceSchema);