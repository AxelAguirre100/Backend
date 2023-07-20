import { findCartById, updateCart, createCart } from "../../dao/services/cartService.js";
import { findProductById } from "../../dao/services/productService.js";
import productModel from "../../dao/models/MongoDB/productModel.js";
import { CustomError } from '../../utils/errors/customErrors.js';
import { ErrorEnum } from "../../utils/errors/errorEnum.js";
import { generateAddProductToCartErrorInfo } from "../../utils/errors/errorInfo.js";

export const getCart = async (req, res) => {
  if (req.session.login) {
    const idCart = req.session.user.idCart;

    try {
      const cart = await findCartById(idCart);

      if (!cart) {
        throw new Error(`El carrito no existe`);
      }

      const cartPopulate = await cart.populate({ path: "products.productId", model: productModel })
      res.status(200).json({
        message: "Carrito devuelto correctamente",
        cart: cartPopulate
      });

    } catch (error) {
      req.logger.fatal("Fatal error/Server connection")
      res.status(500).json({
        message: "Hubo un error en el servidor",
        error: error.message
      })
    }

  } else {
    req.logger.error("Session not found")
    return res.status(401).send("No existe sesion activa")
  }
}

export const updateCartProducts = async (req, res) => {
  if (req.session.login) {
    const idCart = req.session.user.idCart;
    const info = req.body;
    try {
      await updateCart(idCart, { products: info });
      const cart = await findCartById(idCart)
      req.logger.info("Cart updated");
      return res.status(200).json({
        message: "Carrito actualizado",
        cart: await cart.populate({ path: "products.productId", model: productModel })
      });

    } catch (error) {
      req.logger.fatal("Fatal error/Server connection");
      res.status(500).json({
        message: "Hubo un error en el servidor",
        error: error.message
      });
    }

  } else {
    req.logger.error("Session not found");
    return res.status(401).json({ message: "No existe sesión activa" });
  }
}


export const addProductToCart = async (req, res, next) => {
  try {
    if (!req.session.login) {
      return res.status(401).send("No existe sesión activa");
    }

    const idCart = req.session.user.idCart;
    const idProduct = req.params.pid;
    const productoExiste = await findProductById(idProduct);

    if (!productoExiste) {
      throw CustomError.createError({
        name: "Add Product Error",
        message: "Missing Product",
        cause: generateAddProductToCartErrorInfo(idProduct),
        code: ErrorEnum.MISSING_FIELDS
      });
    }

    const carrito = await findCartById(idCart);

    if (productoExiste.owner.equals(req.session.user._id)) {
      return res.status(403).json({
        message: "El propietario del producto no puede agregarlo al carrito"
      });
    }

    const productIndex = carrito.products.findIndex(product => product.productId == idProduct);

    if (productIndex === -1) {
      carrito.products.push({ productId: idProduct });
    } else {
      carrito.products[productIndex].quantity += 1;
    }

    await carrito.save();
    req.logger.info("New Product in the cart, id:" + idProduct);

    return res.status(200).json({
      message: "Producto agregado al carrito",
      carrito: await carrito.populate({ path: "products.productId", model: productModel })
    });
  } catch (error) {
    req.logger.fatal("Fatal error/Server connection");
    res.status(500).json({
      message: "Hubo un error en el servidor",
      error: error.message
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    if (!req.session.login) {
      return res.status(401).send("No existe sesión activa");
    }

    const { quantity } = req.body;
    const cartId = req.session.user.idCart;
    const productId = req.params.pid;
    const newQuantity = parseInt(quantity);

    const cart = await findCartById(cartId);
    const product = cart.products.find(product =>
      product.productId.equals(productId)
    );

    if (!product) {
      throw new Error('El producto no se encuentra en el carrito.');
    }

    const productStock = await findProductById(product.productId);

    if (newQuantity > productStock.stock) {
      return res.status(400).json({
        message: 'La cantidad solicitada excede el stock disponible',
        cart: await cart.populate({ path: 'products.productId', model: productModel })
      });
    }

    product.quantity = newQuantity;
    await cart.save();

    return res.status(200).json({
      message: 'Cantidad del producto actualizada exitosamente',
      cart: await cart.populate({ path: 'products.productId', model: productModel })
    });
  } catch (error) {
    req.logger.fatal('Error al actualizar la cantidad del producto');
    res.status(500).send({
      message: 'Hubo un error en el servidor',
      error: error.message
    });
  }
};

export const deleteAllProductsFromCart = async (req, res) => {
  if (req.session.login) {
    const idCart = req.session.user.idCart;

    try {
      await updateCart(idCart, { products: [] });
      return res.status(200).json({ message: "Productos borrados" })

    } catch (error) {
      req.logger.fatal("Fatal error/Server connection")
      res.status(500).send({
        message: "Hubo un error en el servidor",
        error: error.message
      })
    }

  } else {
    return res.status(401).send("No existe sesion activa")
  }
}

export const deleteOneProductFromCart = async (req, res) => {
  if (req.session.login) {
    const idCart = req.session.user.idCart;
    const idProduct = req.params.pid;

    try {
      const cart = await findCartById(idCart);
      const productIndex = cart.products.findIndex(product =>
        product.productId.equals(idProduct)
      );

      if (productIndex === -1) {
        throw new Error('El producto no existe en el carrito.');
      }

      const product = cart.products[productIndex];
      const databaseProduct = await findProductById(product.productId);

      if (databaseProduct.stock + product.quantity < 0) {
        return res.status(400).json({
          message: 'La cantidad excede el stock disponible',
          cart: await cart.populate({ path: 'products.productId', model: productModel })
        });
      }

      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.status(200).json({
        message: 'El producto ha sido eliminado del carrito',
        cart: await cart.populate({ path: 'products.productId', model: productModel })
      });
    } catch (error) {
      req.logger.fatal('Fatal error/Server connection');
      res.status(500).send({
        message: 'Hubo un error en el servidor',
        error: error.message
      });
    }
  } else {
    return res.status(401).send('No existe sesión activa');
  }
};