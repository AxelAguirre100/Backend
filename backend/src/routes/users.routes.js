import { Router } from 'express'
import { getUsers, deleteInactive } from "../dto/controllers/userController.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerUsers = Router()

routerUsers.get('/get',roleVerification(["Admin"]), getUsers)
routerUsers.delete('/delete',roleVerification(["Admin"]), deleteInactive)

export default routerUsers