import { Router } from "express";
import { getProducts, getProduct, addProducts, updateProduct, deleteProduct } from "../dto/controllers/productController.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerProduct = Router();

routerProduct.get('/', getProducts); 
routerProduct.get('/:pid', getProduct);
routerProduct.post('/', addProducts);
routerProduct.put('/:pid', updateProduct);
routerProduct.delete('/:pid', deleteProduct); 

export default routerProduct