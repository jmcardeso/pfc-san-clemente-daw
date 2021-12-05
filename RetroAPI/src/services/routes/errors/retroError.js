/**
 * Clase heredera de Error para personalizar los errores con un código de estado
 */
class RetroError extends Error {
    constructor(msg, statusCode, ...params) {
        super(...params);

        this.message = msg;
        this.statusCode = statusCode;
    }
}

module.exports = RetroError;