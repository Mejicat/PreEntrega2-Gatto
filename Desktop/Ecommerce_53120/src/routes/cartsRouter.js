import { Router } from 'express';
import { cartManagerDB } from '../dao/cartManagerDB.js';
import { auth } from "../middlewares/auth.js";

const router = Router();

const CartService = new cartManagerDB()

router.get('/:cid', auth, async (req, res) => {
    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid)
        res.render(
            "cart",
          {
            layout: 'cart',
            cartId: req.params.cid,
            products: result.products
          })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

export default router