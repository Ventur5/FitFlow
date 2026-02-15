const HttpException = require('../exceptions/index')
const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        return res.status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                message: err.message,
                error: err.error
            })
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: object ID is invalid or malformed',
                error: err.error
            })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(err.statusCode ?? 400)
            .json({
                statusCode: err.statusCode ?? 400,
                message: 'Mongoose: one of more passed or required props failed the validation',
                errors: err.errors,
            })
    }

    res.status(500)
        .json({
            status: 'error',
            message: 'Internal Server Error',
            error: 'An error has occurred, please try again or contact the developer'
        })
}

module.exports = errorHandler