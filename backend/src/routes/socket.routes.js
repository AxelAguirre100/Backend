import { Router } from "express";
import { sendMessage, getMessages } from "../dto/controllers/chatController.js";
import { sendSMS } from "../utils/sms.js";
import { roleVerification } from "../utils/errorMessages.js";
const routerSocket = Router();

routerSocket.post('/chat', sendMessage);
routerSocket.get('/chat',roleVerification(["Admin"]), getMessages);
routerSocket.post('/sms', sendSMS);

export default routerSocket;