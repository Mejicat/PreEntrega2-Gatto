import { Router } from 'express';
import { productManagerDB } from '../dao/productManagerDB.js';
import { cartManagerDB } from '../dao/cartManagerDB.js';

const router = Router();
const ProductService = new productManagerDB();
const CartService = new cartManagerDB();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManagerService.getAllCarts()
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
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {

    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity
    try {
        await cartManagerService.addProductToCart(cartId, productId, quantity)
        res.send({ status: 'success', message: 'producto agregado al carrito' })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const products = req.body.products
    try {
      const cart = await cartManagerService.updateCart(cartId, products)
      res.send({status:'success', message:'carrito editado', cart});
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
      await cartManagerService.updateProductQuantity(cartId, productId, quantity)
      res.send({status:'success', message:'cantidad editada', cart});
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
      await cartManagerService.deleteAllProductsFromCart(cartId);
      res.send("Carrito eliminado")
    } catch (error) {
      return res.status(400).send({status:'error', error:'ha ocurrido un error'})
    }
  })
  
  router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid
    try {
      await cartManagerService.deleteProductFromCart(cartId, productId)
      res.send('Producto ' + productId + ' eliminado del carrito')
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
  })

export default router;