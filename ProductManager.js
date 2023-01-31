const fs = require('fs');
const ruta = "./productos.txt";
const crearArchivo = async (ruta) => {
    if (!fs.existsSync(ruta)) {
        await fs.promises.writeFile(ruta, "[]")
    } else if ((await fs.promises.readFile(ruta, "utf-8")).length == 0) {
        await fs.promises.writeFile(ruta, "[]")
    }
}

class Producto {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

const producto1 = new Producto("Remera adidas", "Remera negra", 10000, "Sin imagen", "abc1", 23);
const producto2 = new Producto("Remera nike", "Remera Blanca", 9000, "Sin imagen", "abc2", 20);
const producto3 = new Producto("Pantalon adidas", "Pantalones adidas", 6000, "Sin imagen", "abc3", 17);
const productoVacio = new Producto("", "", "", "", "", "");
const productoPrueba = new Producto("producto prueba", "producto prueba", 4400, "Sin Imagen", "abc4", 25);

class ProductManager {
    constructor() {
        this.path = ruta;
    }
    addProduct = async (newProduct) => {
        if (toString(newProduct.id).length > 0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0 && newProduct.thumbnail.length > 0 && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
            let contenido = await fs.promises.readFile(this.path, "utf-8");
            let arrayProductos = JSON.parse(contenido);
            if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
                console.error("El producto ya existe");
            } else {
                let contenido = await fs.promises.readFile(this.path, "utf-8");
                let aux = JSON.parse(contenido);
                console.log()
                if (aux.length > 0) {
                    const idAutoincremental = aux[aux.length - 1].id + 1;
                    aux.push({ id: idAutoincremental, ...newProduct });
                    await fs.promises.writeFile(this.path, JSON.stringify(aux));
                } else {
                    const idAutoincremental = 1;
                    aux.push({ id: idAutoincremental, ...newProduct });
                    await fs.promises.writeFile(this.path, JSON.stringify(aux));
                }

            }
        } else {
            console.error("Los campos no deben estar vacios")
        }
    }

    getAllProducts = async () => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        return aux;
    }

    getProductById = async (id) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            return aux[pos];
        } else {
            return "No se encontró el producto que desea ver"
        }
    }
    deleteProductById = async (id) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
            console.log("Producto eliminado exitosamente");
        } else {
            console.error("No se encontró el producto que desea eliminar")
        }
    }

    updateProduct = async ({ id, title, description, price, thumbnail, code, stock }) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            if (title != undefined) {
                if (title.length > 0) {
                    aux[pos].title = title;
                }
            }
            if (description != undefined) {
                if (description.length > 0) {
                    aux[pos].description = description;
                }
            }
            if (price != undefined) {
                if (price.length > 0) {
                    aux[pos].price = parseFloat(price);
                }
            }
            if (thumbnail != undefined) {
                if (thumbnail.length > 0) {
                    aux[pos].thumbnail = thumbnail;
                }
            }
            if (code != undefined) {
                if (code.length > 0) {
                    aux[pos].code = code;
                }
            }
            if (stock != undefined) {
                if (stock.length > 0) {
                    aux[pos].stock = parseInt(stock);
                }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(aux))
            console.log("Producto actualizado exitosamente");
        } else {
            console.log("No se encontro el producto para actualizar")
        }
    }
}

productManager = new ProductManager()

const tests = async () => {
    await crearArchivo(ruta);
    console.log(await productManager.getAllProducts());
    await productManager.addProduct(productoVacio);
    await productManager.addProduct(producto1);
    await productManager.addProduct(producto2);
    await productManager.addProduct(producto3);
    await productManager.addProduct(productoPrueba);
    console.log(await productManager.getAllProducts());
    console.log(await productManager.getProductById(1));
    await productManager.updateProduct({ id: 1, title: "Prueba cambiando titulo y descripcion del elemento 1", description: "Exito" });
    console.log(await productManager.getProductById(1));
    await productManager.deleteProductById(1);
}

tests()