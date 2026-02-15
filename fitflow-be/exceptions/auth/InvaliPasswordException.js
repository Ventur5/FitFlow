const HttpException = require('../index')

class InvalidPasswordException extends HttpException {
    constructor(
        message = 'Email or password not valid!',
        statusCode = 401,
        error = 'Invalid credentials provided'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = InvalidPasswordException