import {Router} from "express";
import manejoArchivo from "../ProductManager.js";
const manager = new manejoArchivo("./src/datos.json");

const router = Router();

router.get("/", async (req, res) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const products = await manager.getAllProducts();
    if (products.length>0){
        let { limit } = req.query;
        let data;
        if (!limit) {
            data = products;
        } else {
            data = products.slice(0, parseInt(limit));
        }
        res.send(data);
    }else{
        response.send("No hay productos en el archivo o éste no existe")
    }
});

router.get("/:pid", async (request, response) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const product = await manager.getProductById(parseInt(request.params.pid));
    JSON.stringify(product)
    if (product === undefined){
        response.send(`Producto: ${product.title} con la descripción: ${product.description } y el precio ${product.price} `)
    }else{
        response.send("No se encontró el producto")
    }
});

export default router;