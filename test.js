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
        this.products = [];
    }

    addProduct(newProduct) {
        if (toString(newProduct.id).length > 0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0 && newProduct.thumbnail.length > 0 && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
            if (this.products.filter(product => product.code == newProduct.code).length > 0) {
                console.error("El producto ya existe");
            }
            else {
                const idAutoincremental = ProductManager.idAutomatico()
                this.products.push({ id: idAutoincremental, ...newProduct });
            }
        } else {
            console.error("Los campos no deben estar vacios")
        }

    }

    getProductos() {
        return this.products;
    }

    getProductById(id) {
        if (this.products.find(product => product.id == id) != undefined) {
            return this.products.find(product => product.id == id)
        } else {
            return "No se encontro el producto";
        }
    }

    static idAutomatico() {
        if (!this.idAnterior) {
            this.idAnterior = 1
        }
        else {
            this.idAnterior++
        }
        return this.idAnterior
    }
}

productMaganer = new ProductManager()
//Array vacio
console.log(productMaganer.getProductos())
//Agrego los productos
productMaganer.addProduct(producto1);
productMaganer.addProduct(producto2);
productMaganer.addProduct(producto3);
productMaganer.addProduct(productoPrueba);
//Errores parte del tp
productMaganer.addProduct(productoVacio);
productMaganer.addProduct(productoPrueba);
console.log(productMaganer.getProductById(6));
//Listo todos los productos
console.log(productMaganer.getProductos())
console.log(productMaganer.getProductById(3));