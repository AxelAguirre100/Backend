import express from "express";
import routerProduct from "./routes/products.routes.js";
import { __dirname, __filename } from "./path.js";
import { engine } from 'express-handlebars';
import * as path from 'path';
import { Server } from "socket.io";
import routerSocket from "./routes/socket.routes.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let productos = require('./models/products.json')

const app = express();
const PORT = 8080 

const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

routerSocket.get('/realtimeproducts', async (req, res) => {
  res.render("realTimeProducts", {
    titulo: "Desafio 4 Real Time Products",
    products: productos
  });
});

routerSocket.get('/', async (req, res) => {
  res.render("index", {
    titulo: "Desafio 4",
    products: productos
  });
});


const io = new Server(server);

io.on("connection", async(socket)=>{
  console.log("Cliente conectado");
  socket.on("addProduct", (data) =>{
    productos.push(data);
    io.sockets.emit('productos', productos);
    io.sockets.emit('getProducts', productos);
  });
  socket.on("deleteProduct", (data)=>{
    productos = productos.filter((producto) => producto.id != data);
    io.sockets.emit('getProducts', productos);
  });
  socket.emit("getProducts",  productos);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use('/', express.static(__dirname + '/public'));
app.use('/api/products', routerProduct);
app.use('/', routerSocket);