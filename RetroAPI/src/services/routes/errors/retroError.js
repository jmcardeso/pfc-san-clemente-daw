class RetroError extends Error {
    constructor(msg, statusCode, ...params) {
        super(...params);

        this.message = msg;
        this.statusCode = statusCode;
    }
}

module.exports = RetroError;