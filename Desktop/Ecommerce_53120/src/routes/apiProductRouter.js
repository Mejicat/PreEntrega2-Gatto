import express from 'express';

import ProductService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";

const router = express.Router();

router.get('/', auth, isVerified, async (req, res) => {
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    let { query = null, sort = null } = req.query;

    if (query) {
        query = JSON.parse(query);
    }
    if (sort) {
        sort = JSON.parse(sort);
    }

    try {
        const products = await ProductService.getProducts(limit, page, query, sort);
        res.status(200).send({ status: 'success', message: 'productos encontrados', products });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.get('/:productId', auth, isVerified, async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await ProductService.getProductById(productId);
        res.status(200).send({ status: 'success', message: 'producto encontrado', product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.post('/', auth, isVerified, isAdmin, async (req, res) => {
    const { title, description, code, category, thumbnails } = req.body.product;
    const price = +req.body.product.price;
    const stock = +req.body.product.stock;

    if (!title || !description || !code || price == null || stock == null || !category || !thumbnails) {
        return res.status(400).send({
            status: 'error',
            message: 'faltan datos'
        });
    }

    if (typeof price !== 'number' || typeof stock !== 'number') {
        return res.status(400).send({
            status: 'error',
            message: 'price y stock deben ser números'
        });
    }

    if (price < 0 || stock < 0) {
        return res.status(400).send({
            status: 'error',
            message: 'price y stock deben ser mayores a 0'
        });
    }

    try {
        const product = await ProductService.addProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });
        res.status(201).send({ status: 'success', message: 'producto agregado', product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.put('/:productId', auth, isVerified, isAdmin, async (req, res) => {
    const productId = req.params.productId;
    const productData = req.body;

    if (!productData) {
        return res.status(400).send({ status: 'error', message: 'faltan datos' });
    }

    if (typeof productData.price !== 'number' || typeof productData.stock !== 'number') {
        return res.status(400).send({ status: 'error', message: 'price debe ser un número' });
    }

    try {
        const product = await ProductService.updateProduct(productId, productData);
        res.status(200).send({ status: 'success', message: 'producto actualizado', product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.delete('/:productId', auth, isVerified, isAdmin, async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await ProductService.deleteProduct(productId);
        res.status(200).send({ status: 'success', message: 'producto eliminado', product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.get('/mockingproducts', async (req, res) => {
    try {
        const mockProducts = generateMockProducts();
        res.status(200).send({ status: 'success', message: 'Mock products generated', products: mockProducts });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;
