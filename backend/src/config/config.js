import dotenv from 'dotenv';
import {Command} from 'commander';
import { signedCookie } from 'cookie-parser';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path:environment==="production"?"./src/config/.env.production":"./src/config/.env.development"
});


export default {
    MONGODBURL: process.env.MONGODBURL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SIGNED_COOKIE: process.env.SIGNED_COOKIE,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    EMAIL: process.env.EMAIL,
    LOGGER_TYPE: process.env.LOGGER_TYPE
};