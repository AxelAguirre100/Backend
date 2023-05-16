import 'dotenv/config.js'
import config from './config/config.js';
import express from 'express'
import session from 'express-session';
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { initializePassport } from './config/passport.js'
import cors from 'cors'
import routerIndex from './routes/index.routes.js';
import { Server } from "socket.io";
import compression from 'express-compression'
import errorHandler from './middlewares/errors/errorhandler.js';
import {CustomError} from './utils/errors/customErrors.js';

const whiteList = ['http://localhost:3000'] //Rutas validas a mi servidor
//CORS (Me da problemas por eso comentado)
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    // Agrega el encabezado Access-Control-Allow-Origin en todas las respuestas
    exposedHeaders: 'Access-Control-Allow-Origin'
}


//Iniciar Server
const app = express()
const MONGODBURL = config.MONGODBURL;
const SIGNED_COOKIE = config.SIGNED_COOKIE
const SESSION_SECRET = config.SESSION_SECRET
const JWT_SECRET = config.JWT_SECRET

//MIDDLEWARES
app.use(cookieParser(SIGNED_COOKIE))
app.use(express.json())
//app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGODBURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 500
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(compression({
    brotli: { enabled: true, zlib: {} }
}))

//Mongoose
const connectionMongoose = async () => {
    await mongoose.connect(MONGODBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}

connectionMongoose()

app.use(cookieParser(JWT_SECRET))


app.use("/", routerIndex)
app.use(errorHandler)


const server = app.listen(4000, () => {
    console.log(`Server on port 4000`)
})

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: 'GET, POST, PUT, DELETE',
        optionsSuccessStatus: 200,
        preflightContinue: false,
        maxAge: 3600,
    },
}); 