import express from 'express';

import  CartController  from '../controllers/cartController.js';

const router = express.Router();
const cartController = new CartController();

router.post('/cart', (req, res) => cartController.createCart(req, res));
router.get('/cart/:id', (req, res) => cartController.getCartById(req, res));
router.get('/carts', (req, res) => cartController.getAllCarts(req, res));
router.post('/cart/:cartId/product/:productId', (req, res) => cartController.addProductToCart(req, res));
router.put('/cart/:cartId/product/:productId', (req, res) => cartController.updateProductQuantity(req, res));
router.delete('/cart/:cartId/product/:productId', (req, res) => cartController.removeProductFromCart(req, res));
router.delete('/cart/:cartId/products', (req, res) => cartController.emptyCart(req, res));
router.delete('/cart/:cartId', (req, res) => cartController.deleteCart(req, res));

export default router;

