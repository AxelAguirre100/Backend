import 'dotenv/config.js'
import config from './config/config.js';
import express from 'express'
import session from 'express-session';
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { initializePassport } from './config/passport.js'
import routerIndex from './routes/index.routes.js';
import { Server } from "socket.io";
import compression from 'express-compression'
// import errorHandler from './middlewares/errors/errorhandler.js';
import { addLogger } from './utils/logger.js';
import { __dirname } from "./path.js";
import swaggerJSDoc from 'swagger-jsdoc'
import { engine } from 'express-handlebars'
import swaggerUiExpress from 'swagger-ui-express'
import * as path from 'path';

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

const app = express()
const MONGODBURL = config.MONGODBURL;
const SIGNED_COOKIE = config.SIGNED_COOKIE
const SESSION_SECRET = config.SESSION_SECRET
const SECRET = config.SECRET

app.use(cookieParser(SIGNED_COOKIE))
app.use(express.json())
//app.use(cors(corsOptions))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use("/", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGODBURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 500
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400000
    }
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(compression({
    brotli: { enabled: true, zlib: {} }
}))

const connectionMongoose = async () => {
    await mongoose.connect(MONGODBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}

connectionMongoose()

app.use(cookieParser(SECRET))
app.use(addLogger)

app.use("/", routerIndex)
//app.use(errorHandler)


const server = app.listen(4000, () => {
    console.log(`Server on port 4000`)
    // console.log(config);
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

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info:
        {
            title: "documentacion backend",
            description: "API para un ecommerce hecha en NodeJS"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))