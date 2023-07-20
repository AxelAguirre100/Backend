import { Router } from "express";
import { sendLanding, sendProductsView, sendLoginView, sendRegisterView, sendCart} from "../dto/controllers/handlebarsController.js"
const routerHandlebars = Router()

routerHandlebars.get("/login",sendLoginView)
routerHandlebars.get("/",sendLanding)
routerHandlebars.get("/register",sendRegisterView)
routerHandlebars.get("/products",sendProductsView)
routerHandlebars.get("/cart",sendCart)

export default routerHandlebars