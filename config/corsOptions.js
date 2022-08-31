const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'), false)
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions
