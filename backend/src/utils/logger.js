import winston from 'winston'
import config from '../config/config.js';

const LOGGER = config.LOGGER_TYPE

const logFileName = './errors.log'

const customLevelOpt = {
    //De menor a mayor
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    }, //Los colors no los aplico ya que no se ven bien en el archivo
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'blue'
    }
}
//El devLogger solo escribe por consola
const devLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    format: winston.format.simple(),
    transports: [new winston.transports.Console({ level: 'debug' })]
})
//El prodLogger guarda los problemas y errores en el archivo
const prodLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({
            filename: logFileName,
            level: 'error'  //Se mostrarán los que sean mas que warning incluyendolo, al tener 1 solo transport file no escribe varias veces
        })
    ]
})
const getLogger = () => {
    if (LOGGER === "prod") {
        return prodLogger
    }else if(LOGGER === "dev"){
        return devLogger
    }
}
export const addLogger = (req, res, next) => {
    req.logger = getLogger()
    req.logger.info(`Metodo: ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} `)
    next()
}