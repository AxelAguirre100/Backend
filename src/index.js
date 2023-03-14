import "dotenv/config"
import express from "express";
import { Server } from "socket.io";
import { getManagerMessages, getManagerProducts} from "./dao/daoManager.js";
import { __dirname, __filename } from "./path.js";
import routerSocket from "./routes/socket.routes.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/cart.routes.js";
import { engine } from 'express-handlebars';
import * as path from 'path'
import routerChat from "./routes/chat.routes.js";
import { ProductManager } from "./dao/FileSystem/models/ProductManager.js";
import mongoose from "mongoose";
const app = express()

const productManager = new ProductManager("src/dao/FileSystem/Files/products.json");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.set("port", process.env.PORT || 8080)

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`))
const io = new Server(server)

const messageData = await getManagerMessages()
const managerMessage = new messageData.ManagerMessageMongoDB();
const productData = await getManagerProducts()
const managerProduct = new productData.ManagerProductMongoDB();

const ConnectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://axelentoo:Etor25oUbZgzCUno@cluster0.fxgrzcu.mongodb.net/?retryWrites=true&w=majority')
        console.log("conectado")
    } catch (error) {
        console.log(error)
        process.exit();
    }
}

ConnectMongoDB();

io.on("connection", async (socket) => {
    console.log("Cliente conectado")
    socket.on("message", async (info) => {
            managerMessage.addElements([info]).then(() => {
            managerMessage.getElements().then((mensajes) => {
                socket.emit("allMessages", mensajes)
            })
        })
    })
    managerMessage.getElements().then((mensajes) => {
        socket.emit("allMessages", mensajes)
    })
    managerProduct.getElements().then((products) => {
        socket.emit("getProducts", products)
    })
    socket.on("addProduct", async (info) => {
        managerProduct.addElements([info]).then(() => {
            managerProduct.getElements().then((products) => {
            socket.emit("getProducts", products)
        })
    })
    })

    socket.on("deleteProduct", async id=>{
        managerProduct.deleteElement(id).then(() => {
            managerProduct.getElements().then((products) => {
            socket.emit("getProducts", products)
            })
        })
    })
})

app.use('/', routerSocket)
app.use('/chat', routerChat)
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use("/api/carts", routerCart)