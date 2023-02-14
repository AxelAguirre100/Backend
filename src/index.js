import manejoArchivo from "./ProductManager.js";
import express from "express";
import productRouter from "./routes/products.route.js";
import routerCart from "./routes/cart.route.js";

const app = express();
const SERVER_PORT = 8080;
const manager = new manejoArchivo("./src/datos.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async(request, response) => {
    response.send("Desafío 3 - Servidor en express");
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
});

app.use("/api/products", productRouter);
app.use("/api/carts", routerCart)

app.listen(SERVER_PORT, () => {
    console.log(`Server on port:${SERVER_PORT}`);
});