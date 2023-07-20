import { findProductById, insertProducts, updateOneProduct, paginateProducts, deleteOneProduct } from "../../dao/services/productService.js";
import { getSessionObject } from "../controllers/sessionController.js";
import { sendDeleteNotification } from "../../utils/email.js";

export const getProducts = async (req, res, next) => {
    const { limit = 10, page = 1, sort = "", category = "" } = req.query;

    const filters = { stock: { $gt: 0 } };
    if (category) filters.category = category;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };
    if (sort) options.sort = { price: sort === 'desc' ? -1 : 1 }

    try {
        const products = await paginateProducts(filters, options);

        const prevLink = products.hasPrevPage ? `/api/products?category=${category}&limit=${limit}&sort=${sort}&page=${products.prevPage}` : null
        const nextLink = products.hasNextPage ? `/api/products?category=${category}&limit=${limit}&sort=${sort}&page=${products.nextPage}` : null

        return res.status(200).json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        })
    } catch (error) {
        req.logger.fatal("Fatal error: " + error.message)
        res.status(500).send({ error: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await findProductById(productId);
        if (!product) {
            return res.status(404).json({
                message: "El producto no existe"
            });
        }
        return res.status(200).json(product);
    } catch (error) {
        req.logger.fatal("Error fatal al buscar el producto");
        res.status(500).json({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const addProducts = async (req, res,) => {
    try {
        const user = await getSessionObject(req, res);
        const info = req.body;

        if (!info.title || !info.description || !info.code || !info.price || !info.stock || !info.category || !info.thumbnails) {
            return res.status(400).json({
                message: "Faltan campos requeridos para agregar productos"
            });
        }

        if (user) {
            info.owner = user._id;
        }

        const products = await insertProducts(info);

        res.status(200).json({
            message: 'Productos agregados correctamente',
            products: products
        });
    } catch (error) {
        req.logger.fatal("Error fatal: " + error.message);
        res.status(500).json({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    const user = await getSessionObject(req, res);
    if (user.rol == "Premium") {
        const product = await findProductById(req.params.pid);
        if (product) {
            if (product.owner != user._id) {
                return res.status(200).json({
                    message: "You can't modify products if you're not the owner"
                })
            }
        } else {
            return res.status(200).json({
                message: "Product not found"
            })
        }

    }

    const idProduct = req.params.pid;
    const info = req.body;

    try {
        await updateOneProduct(idProduct, info);
        const product = await findProductById(idProduct)
        if (product) {
            return res.status(200).json({
                message: "Producto actualizado",
                product: product
            });
        }

        res.status(404).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        req.logger.fatal("Fatal error: " + error.message)
        res.status(500).send({
            error: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {
    const idProduct = req.params.pid;
    const user = await getSessionObject(req, res);
    if (user.rol == "Premium") {
        const product = await findProductById(req.params.pid);
        if (product) {
            if (product.owner != user._id) {
                return res.status(200).json({
                    message: "You can't delete products if you're not the owner"
                })
            }
        } else {
            return res.status(200).json({
                message: "Product not found"
            })
        }
    }

    try {
        const product = await deleteOneProduct(idProduct);
        if (product) {
            await sendDeleteNotification(user)
            return res.status(200).json({
                message: "Producto eliminado",
                product: product
            });
        }

        res.status(404).json({
            message: "Producto no encontrado"
        });

    } catch (error) {
        req.logger.fatal("Fatal error: " + error.message)
        res.status(500).json({
            error: error.message
        });
    }
}