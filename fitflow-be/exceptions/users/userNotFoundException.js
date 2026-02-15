const HttpException = require('../index')

class UserNotFoundException extends HttpException {
    constructor(
        message = 'User not found',
        statusCode = 404,
        error = 'The requested user does not exist!'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = UserNotFoundException