import { Router } from "express";
import routerSession from "./session.routes.js";
import routerUsers from "./users.routes.js";
import routerGithub from "./github.routes.js";
import routerProduct from "./products.routes.js";
import routerCarts from "./cart.routes.js";
import routerUtils from "./utils.routes.js";
import routerSocket from "./socket.routes.js";
import routerMocking from "./mocking.routes.js";
import routerLogger from "./logger.routes.js";
import routerHandlebars from "./handlebars.routes.js";
const routerIndex = Router()

routerIndex.use("/api/auth", routerSession)
routerIndex.use("/auth", routerGithub)
routerIndex.use("/api/user", routerUsers)
routerIndex.use("/api/products",routerProduct)
routerIndex.use("/api/cart",routerCarts)
routerIndex.use("/api/utils", routerUtils)
routerIndex.use("/api/socket", routerSocket)
routerIndex.use("/api",routerMocking)
routerIndex.use("/loggerTest",routerLogger)
routerIndex.use("/handlebars",routerHandlebars)

export default routerIndex