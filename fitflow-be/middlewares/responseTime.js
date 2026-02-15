const responseTimeMiddleware = (request, response, next) => {
    const start = process.hrtime.bigint()

    response.on('finish', () => {
        const end = process.hrtime.bigint()
        const durationInMilliseconds = Number(end - start) / 1_000_000

        console.log(`Request ${request.method} to ${request.originalUrl} took ${durationInMilliseconds.toFixed(2)} milliseconds`)
    })

    next()
}

module.exports = responseTimeMiddleware