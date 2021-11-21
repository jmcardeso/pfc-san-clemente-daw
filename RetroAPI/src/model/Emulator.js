const { model, Schema } = require('mongoose');

const EmulatorSchema = Schema({
    Name: { type: String, required: true },
    License: { type: String, required: false },
    Web: { type: String, required: false },
    Description: { type: String, required: true },
    Author: { type: String, required: false }
});

EmulatorSchema.methods.toJSON = function(){
    const {_id, ...Emulator} = this.toObject();
    return Emulator;
}

module.exports = model('Emulator', EmulatorSchema);