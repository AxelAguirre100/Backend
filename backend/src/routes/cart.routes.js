import { Router } from "express";
import { getCart, updateCartProducts, addProductToCart, updateProductQuantity, deleteAllProductsFromCart, deleteOneProductFromCart } from "../dto/controllers/cartController.js";
import { generateTicketAndSave } from "../dto/controllers/ticketController.js";
import { roleVerification } from "../utils/errorMessages.js";
const routerCarts = Router();

routerCarts.get('/', getCart);
routerCarts.put('/',roleVerification(["Usuario","Premium"]), updateCartProducts);
routerCarts.post('/product/:pid',roleVerification(["Usuario","Premium"]), addProductToCart); 
routerCarts.put('/product/:pid',roleVerification(["Usuario","Premium"]), updateProductQuantity);
routerCarts.delete('/',roleVerification(["Usuario","Premium"]), deleteAllProductsFromCart);
routerCarts.delete('/product/:pid',roleVerification(["Usuario","Premium"]), deleteOneProductFromCart);
routerCarts.post('/purchase',roleVerification(["Usuario","Premium"]),generateTicketAndSave)
export default routerCarts