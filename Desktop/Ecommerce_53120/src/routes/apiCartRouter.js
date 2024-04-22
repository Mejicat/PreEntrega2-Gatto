import { Router } from 'express';
import { cartManagerDB } from '../dao/cartManagerDB.js';

const router = Router();
const CartService = new cartManagerDB();

router.post('/', async (req, res) => {

    try {
        const userId = req.session.user._id
        const result = await CartService.createCart(userId)
        res.send({
            status: "success",
            message: "carrito creado",
            payload: result,
            cart
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity
    try {
        await CartService.addProductToCart(cartId, productId, quantity)
        res.send({ 
            status: 'success', 
            message: 'producto agregado al carrito'
         })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const carts = await CartService.getAllCarts()
        res.send({ carts })
    } catch (error) {
        console.error(error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid)
        res.send({
            status: 'success',
            payload: result,
            cart
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
})

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const products = req.body.products
    try {
      const cart = await CartService.updateCart(cartId, products)
      res.send({
        status:'success', 
        message:'carrito editado',
        cart
    })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
  })
  
  router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity 
    try {
      await CartService.updateProductQuantity(cartId, productId, quantity)
      res.send({
        status:'success', 
        message:'cantidad editada', 
        cart});
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
  })
  
  router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
      await CartService.deleteAllProductsFromCart(cartId);
      res.send("Carrito eliminado")
    } catch (error) {
      return res.status(400).send({
        status:'error', 
        error:'ha ocurrido un error'
    })
    }
  })
  
  router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid
    try {
      await CartService.deleteProductFromCart(cartId, productId)
      res.send('Producto ' + productId + ' eliminado del carrito')
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
  })

export default router;