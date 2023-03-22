// import fs from "fs";
// import { getManagerProducts } from "../../daoManager.js";


// class Producto {
//     constructor(title, description, price, thumbnail, code, stock,status,category) {
//         this.title = title;
//         this.description = description;
//         this.price = price;
//         this.thumbnail = thumbnail;
//         this.code = code;
//         this.stock = stock;
//         this.status = status;
//         this.category = category;
//     }
// }


// const producto1 = new Producto("Remera", "Remera adidas negra", 10000, ["public/img/remera-adidas"], "abc1", 23, true, "Remera");
// const producto2 = new Producto("Remera", "Remera nike Blanca", 9000, ["public/img/remera-nike"], "abc2", 20, true, "Remera");
// const producto3 = new Producto("Pantalon", "Pantalones adidas", 6000, ["public/img/pantalon-adidas"], "abc3", 17, true, "Pantalon");
// const producto4 = new Producto("Pantalon", "Pantalones nike", 5000, ["public/img/pantalon-nike"], "abc4", 16, true, "Pantalon");
// const producto5 = new Producto("Zapatilla", "Zapatillas adidas", 8000, ["public/img/zapatillas-adidas"], "abc5", 18, true, "Zapatilla");
// const producto6 = new Producto("Zapatilla", "Zapatillas nike", 9000, ["public/img/zapatillas-nike"], "abc6", 15, true, "Zapatilla");
// const producto7 = new Producto("Jean", "Jeans Wander Denim", 6000, ["public/img/jeans-wander-denim"], "abc7", 14, true, "Pantalon");
// const producto8 = new Producto("Zapatilla", "Zapatillas Converse", 8000, ["public/img/zapatillas-converse"], "abc8", 14, true, "Zapatilla");
// const producto9 = new Producto("Camisa", "Camisa Sico Urban", 7000, ["public/img/camisa-sico-urban"], "abc9", 14, true, "Camisa");
// const producto10 = new Producto("Pantalon", "Pantalones Sico Urban", 6000, ["public/img/pantalones-sico-urban"], "abc10", 14, true, "Pantalon");


// export class ProductManager {
//     constructor(path) {
//         this.path = path;
//     }

//     checkArchivo = ()=>{
//         return fs.existsSync(this.path)       
//     }
//     crearArchivo = async () => {
//         await fs.promises.writeFile(this.path, "[]")
//     }
//     addProduct = async (newProduct) => {
//         let i=0;
//         let cantidadCampos=8;
//         for (const campo in newProduct){
//             i++
//         }
//         if (i==cantidadCampos){
//             if (newProduct.status===true && newProduct.category.length>0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0  && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
//                 let contenido = await fs.promises.readFile(this.path, "utf-8");
//                 let arrayProductos = JSON.parse(contenido);
//                 if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
//                     return "Ya existe el producto";
//                 }
//                 else 
//                 {
//                     let contenido = await fs.promises.readFile(this.path, "utf-8");
//                     let aux = JSON.parse(contenido);
//                     if (aux.length>0){
//                         const idAutoincremental = aux[aux.length-1].id+1;
//                         aux.push({ id: idAutoincremental, ...newProduct });
//                         await fs.promises.writeFile(this.path, JSON.stringify(aux));
//                         return "Producto Agregado"
//                     }
//                     else{
//                         const idAutoincremental = 1;
//                         aux.push({ id: idAutoincremental, ...newProduct });
//                         await fs.promises.writeFile(this.path, JSON.stringify(aux));
//                         return "Producto agregado"
//                     }
    
//                 }
//             } else {
//                 return "No puede tener campos vacios"
//             }
//         }else{
//             return `Falta o sobra al menos 1 campo (deben ser ${cantidadCampos})`
//         }
       
//     }

//     getAllProducts= async()=> {
//         let contenido = await fs.promises.readFile(this.path, 'utf-8')  
//         let aux = JSON.parse(contenido)
//         return aux;   
//     }
//     updateProduct = async({id, title, description, price, thumbnail, code, stock, status, category})  => {
//         let contenido = await fs.promises.readFile(this.path, 'utf-8')  
//         let aux = JSON.parse(contenido)
//         if(aux.some(product=> product.id === id)) {
//             let pos = aux.findIndex(product => product.id === id)
//             if (title!=undefined){
//                 if (title.length>0)
//                 {
//                     aux[pos].title = title;
//                 }
//             }
//             if (description!=undefined){
//                 if (description.length>0)
//                 {
//                     aux[pos].description = description;
//                 }
//             }
//             if (price!=undefined){
//                 if (price.length>0)
//                 {
//                     aux[pos].price = parseFloat(price);
//                 }
//             }
//             if (thumbnail!=undefined){
//                 if (thumbnail.length>0)
//                 {
//                     aux[pos].thumbnail = thumbnail;
//                 }
//             }
//             if (aux.some(prod => prod.code==code)){
//                 return "No puede poner un codigo que ya existe"
//             }else if(code!=undefined){
//                 if (code.length>0)
//                 {
//                     aux[pos].code = code;
//                 }
//             }
//             if (stock!=undefined){
//                 if (stock.length>0)
//                 {
//                     aux[pos].stock = parseInt(stock);
//                 }
//             }        
//             if (status!=undefined){
//                 if (status==false)
//                 {
//                     aux[pos].status = false;
//                 }else{
//                     aux[pos].status = true;
//                 }
//             }
//             if (category!=undefined){
//                 if (category.length>0)
//                 {
//                     aux[pos].category = category;
//                 }
//             }
            
//             await fs.promises.writeFile(this.path, JSON.stringify(aux))
//             return "Producto actualizado exitosamente";
//         } else {
//             return  "Producto no encontrado para actualizar"
//         }
    
//     }
//     getProductById= async(id)=> {
//         let contenido = await fs.promises.readFile(this.path, 'utf-8')  
//         let aux = JSON.parse(contenido)
//         if(aux.some(product=> product.id === id)) 
//         {
//             let pos = aux.findIndex(product => product.id === id)
//             return aux[pos];
//         }else{
//             return null
//         }        
//     }

//     deleteProductById= async(id)=> {
//         let contenido = await fs.promises.readFile(this.path, 'utf-8')
//         let aux = JSON.parse(contenido)
//         if(aux.some(product=> product.id === id)) 
//         {
//             const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
//             await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
//             return "Producto eliminado exitosamente";           
//         }else{
//             return "No se encontró el producto que desea eliminar"
//         }        
//     }
//     devolverArrayProductos = ()=>{
//         return [producto1,producto2,producto3,producto4,producto5,producto6,producto7,producto8,producto9]
//     }
//     cargarArchivo = async () => {
//         await this.crearArchivo();
//         await this.addProduct(producto1);
//         await this.addProduct(producto2);
//         await this.addProduct(producto3);
//         await this.addProduct(producto4);
//         await this.addProduct(producto5);
//         await this.addProduct(producto6);
//         await this.addProduct(producto7);
//         await this.addProduct(producto8);
//         await this.addProduct(producto9);
//         await this.addProduct(producto10);
//     }
// }