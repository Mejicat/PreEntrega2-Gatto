import { Router } from 'express';
import { cartManagerDB } from '../dao/cartManagerDB.js';

const router = Router();

const CartService = new cartManagerDB()

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
        })
    }
})

export default router