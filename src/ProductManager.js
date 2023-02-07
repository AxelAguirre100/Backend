import fs from "fs";

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

const producto1 = new Producto("Remera", "Remera adidas negra", 10000, "Sin imagen", "abc1", 23);
const producto2 = new Producto("Remera", "Remera nike Blanca", 9000, "Sin imagen", "abc2", 20);
const producto3 = new Producto("Pantalon", "Pantalones adidas", 6000, "Sin imagen", "abc3", 17);
const producto4 = new Producto("Pantalon", "Pantalones nike", 5000, "Sin imagen", "abc4", 16);
const producto5 = new Producto("Zapatillas", "Zapatillas adidas", 8000, "Sin imagen", "abc5", 18);
const producto6 = new Producto("Zapatillas", "Zapatillas nike", 9000, "Sin imagen", "abc6", 15);
const producto7 = new Producto("Jeans", "Jeans Wander Denim", 6000, "Sin imagen", "abc7", 14);
const producto8 = new Producto("Zapatillas", "Zapatillas Converse", 8000, "Sin imagen", "abc8", 14);
const producto9 = new Producto("Camisa", "Camisa Sico Urban", 7000, "Sin imagen", "abc9", 14);
const producto10 = new Producto("Pantalones", "Pantalones Sico Urban", 6000, "Sin imagen", "abc10", 14);

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkArchivo = ()=>{
        return fs.existsSync(this.path)       
    }
    crearArchivo = async () => {
        await fs.promises.writeFile(this.path, "[]")
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

    cargarArchivo = async () => {
        await this.crearArchivo();
        await this.addProduct(producto1);
        await this.addProduct(producto2);
        await this.addProduct(producto3);
        await this.addProduct(producto4);
        await this.addProduct(producto5);
        await this.addProduct(producto6);
        await this.addProduct(producto7);
        await this.addProduct(producto8);
        await this.addProduct(producto9);
        await this.addProduct(producto10);
    }
}

export default ProductManager;