const logger = (request, response, next) => {
    const { method, ip, url } = request
    const todayDate = new Date().toISOString()

    console.log(`[${todayDate}] - Effettuata richiesta ${method} da ip ${ip} ad indirizzo ${url}`)

    next()
}


module.exports = logger