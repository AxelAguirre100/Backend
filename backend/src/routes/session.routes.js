import { Router } from "express";
import { loginUser, registerUser, destroySession, getSession } from "../dto/controllers/sessionController.js";
const routerSession = Router()

routerSession.post("/register", registerUser)
routerSession.post("/login", loginUser)
routerSession.get("/logout", destroySession);
routerSession.get("/current", getSession);

export default routerSession