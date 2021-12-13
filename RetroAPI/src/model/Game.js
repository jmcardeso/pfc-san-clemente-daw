const { model, Schema } = require('mongoose');

const GameSchema = Schema({
    name: { type: String, required: true, unique: true, sparse: true },
    studio: { type: String, required: false },
    year: { type: Number, required: false },
    description: [{
        lang: { type: String, required: false },
        content: { type: String, required: false }
    }],
    genre: { type: String, required: false },
    image: {type: [String], required: false }
});

module.exports = model('Game', GameSchema);