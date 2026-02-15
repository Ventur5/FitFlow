const { body, validationResult } = require('express-validator')

const rules = [
    body('firstName')
        .notEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage('FirstName must be a valid string'),
    body('lastName')
        .notEmpty()
        .isString()
        .withMessage('LastName must be a valid string'),
    body('age')
        .optional()
        .isInt()
        .withMessage('Age must be a valid number'),
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .notEmpty()
        .isString()
        .isLength({ min: 8 })
        .withMessage('Password must be minimum 8 character')
]

const validateUserBody = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({
                errors: errors.array()
            })
    }

    next()
}

module.exports = {validateUserBody, rules}
