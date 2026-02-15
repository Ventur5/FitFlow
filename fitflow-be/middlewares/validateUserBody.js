const validateUserBody = (req, res, next) => {
    const errors = []

    const {
        firstName,
        lastName,
        age,
        email,
        password,
    } = req.body

    if (typeof firstName !== "string") {
        errors.push('FirstName must be a string')
    }

    if (typeof lastName !== "string") {
        errors.push('LastName must be a string')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email must be valid')
    }

    if (typeof password !== "string" || password.length < 8) {
        errors.push('Password must be a string and must contain at least 8 characters')
    }

    if (typeof age !== "number") {
        errors.push('Age must be a valid number')
    }

    if (errors.length > 0) {
        res.status(400)
            .send({ errors })
    } else {
        next()
    }
}

module.exports = validateUserBody