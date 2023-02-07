import manejoArchivo from "./ProductManager.js";
import express from "express";

const app = express();
const SERVER_PORT = 8080;
const manager = new manejoArchivo("./src/datos.json");

app.use(express.urlencoded({ extended: true }));


app.get("/", async(request, response) => {
    response.send("Desafío 3 - Servidor en express");
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
});

app.get("/products", async (request, response) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const products = await manager.getAllProducts();
    if (products.length>0){
        let { limit } = request.query;
        let data;
        if (!limit) {
            data = products;
        } else {
            data = products.slice(0, parseInt(limit));
        }
        response.send(data);
    }else{
        response.send("No hay productos en el archivo o éste no existe")
    }

});

app.get("/products/:pid", async (request, response) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const product = await manager.getProductById(parseInt(request.params.pid));
    JSON.stringify(product)
    if (product){
        response.send(`Producto: ${product.title} con la descripción: ${product.description } y el precio ${product.price} `)
    }else{
        response.send("No se encontró el producto")
    }
});

app.listen(SERVER_PORT, () => {
    console.log(`Server on port:${SERVER_PORT}`);
});