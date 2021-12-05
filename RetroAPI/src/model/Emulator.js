const { model, Schema } = require('mongoose');

const EmulatorSchema = Schema({
    name: { type: String, required: true, unique: true },
    license: { type: String, required: false },
    web: { type: String, required: false },
    description: [{
        lang: { type: String, required: false },
        content: { type: String, required: false }
    }],
    author: { type: String, required: false }
});

module.exports = model('Emulator', EmulatorSchema);