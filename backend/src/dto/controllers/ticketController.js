import { findCartById } from "../../dao/services/cartService.js";
import { findProductById } from "../../dao/services/productService.js";
import { createTicket, returnLastCode } from "../../dao/services/ticketService.js";

export const generateTicketAndSave = async (req, res) => {
    const cart = await findCartById(req.session.user.idCart);
    if (cart.products.length > 0) {
        const ticketProducts = [];
        let totalAmount = 0;
        let productosSinStock = [];
        
        for (const cartProduct of cart.products) {
            const databaseProduct = await findProductById(cartProduct.productId);
            if (databaseProduct) {
                if (databaseProduct.stock >= cartProduct.quantity) {
                    totalAmount += databaseProduct.price * cartProduct.quantity;
                    databaseProduct.stock -= cartProduct.quantity;
                    await databaseProduct.save();
                    ticketProducts.push({
                        productName: databaseProduct.title,
                        quantity: cartProduct.quantity
                    });
                } else {
                    productosSinStock.push({
                        productName: databaseProduct.title,
                        quantityInCart: cartProduct.quantity,
                        availableStock: databaseProduct.stock
                    });
                }
            } else {
                const productosSinProcesar = cart.products;
                cart.products = [];
                await cart.save();

                return res.status(404).send({
                    message: "No existe el producto que está en el carrito, su carrito se vació",
                    productosSinProcesar: productosSinProcesar
                });
            }
        }
        
        const lastCode = await returnLastCode();
        const nextCode = lastCode ? lastCode.code + 1 : 1;
        const ticket = await createTicket({
            code: nextCode,
            products: ticketProducts,
            total: totalAmount,
            buyerEmail: req.session.user.email
        });
        
        cart.products = [];
        await cart.save();
        
        if (productosSinStock.length > 0) {
            return res.status(200).send({
                message: "Ticket generado, se vació el carrito, hay productos que no tienen stock",
                ticket: ticket,
                productosSinStock: productosSinStock
            });
        } else {
            return res.status(200).send({
                message: "Ticket generado, se vació el carrito",
                ticket: ticket
            });
        }
    } else {
        return res.status(404).send("El carrito está vacío");
    }
};