const HttpException = require('../index')

class InvalidOrMissingTokenException extends HttpException {
    constructor(
        message = 'Invalid or missing token',
        statusCode = 401,
        error = 'The provided token is invalid or expired'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = InvalidOrMissingTokenException