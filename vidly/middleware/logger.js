const winston = require('winston');
require('winston-mongodb');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logfile.log' }),
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'info' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});
