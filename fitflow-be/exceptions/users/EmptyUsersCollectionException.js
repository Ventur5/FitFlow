const HttpException = require('../index')

class EmptyUsersCollectionException extends HttpException {
    constructor(
        message = 'Users collection does not contain any record',
        statusCode = 404,
        error = 'Your collection is empty!'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = EmptyUsersCollectionException