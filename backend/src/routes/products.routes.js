import { Router } from "express";
import { getProducts, getProduct, addProducts, updateProduct, deleteProduct } from "../dto/controllers/productController.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerProduct = Router();

routerProduct.get('/', getProducts); 
routerProduct.get('/:pid', getProduct);
routerProduct.post('/',roleVerification(["Admin","Premium"]), addProducts);
routerProduct.put('/:pid',roleVerification(["Admin","Premium"]), updateProduct);
routerProduct.delete('/:pid',roleVerification(["Admin","Premium"]), deleteProduct);

export default routerProduct