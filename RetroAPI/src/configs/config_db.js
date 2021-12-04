const mongoose = require('mongoose');

const dbConnectionSync = async() => {

    try {
        // https://stackoverflow.com/a/66197527/1820838
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 1500,
        });

        return "RetroAPI: Database online";

    } catch (error) {
        throw new Error('RetroAPI: Error connecting to database')
    }
}

module.exports = {
    dbConnectionSync,
}