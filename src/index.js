import express from "express";
import routerProduct from "./routes/products.routes.js";
import { __dirname, __filename } from "./path.js";
import { engine } from 'express-handlebars';
import * as path from 'path';
import { Server } from "socket.io";
import { ProductManager } from "./controllers/ProductManager.js";
import routerSocket from "./routes/socket.routes.js";

const productManager =  new ProductManager('src/models/products.json');
const app = express();
const PORT = 8080 

const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

io.on("connection", async(socket)=>{
  console.log("Cliente conectado");
  socket.on("addProduct", async info =>{
    const newProduct = {...info, status:true };
    var mensajeAgregar = await productManager.addProduct(newProduct);
    socket.emit("mensajeProductoAgregado",mensajeAgregar);
    console.log(mensajeAgregar);
  });
  socket.on("deleteProduct", async id=>{
    var mensajeBorrar = await productManager.deleteProductById(id);
    socket.emit("mensajeProductoEliminado",mensajeBorrar);
    console.log(mensajeBorrar);
  });
  socket.emit("getProducts",  await productManager.getAllProducts());
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use('/', express.static(__dirname + '/public'));
app.use('/api/products', routerProduct);
app.use('/', routerSocket);