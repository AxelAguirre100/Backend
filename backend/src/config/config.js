import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();


const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});

export default {
    MONGODBURL: process.env.MONGODBURL,
    SECRET: process.env.SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SIGNED_COOKIE: process.env.SIGNED_COOKIE,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    EMAIL: process.env.EMAIL,
    LOGGER_TYPE: process.env.LOGGER_TYPE,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER: process.env.TWILIO_NUMBER
};