import { Router } from 'express'
import { sendEmail } from '../utils/email.js'
const routerUtils = Router()

routerUtils.get('/email', sendEmail)

export default routerUtils