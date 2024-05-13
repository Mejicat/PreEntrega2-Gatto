import { Router } from 'express'
import { cartManagerDB } from '../dao/cartManagerDB.js'
import { auth } from "../middlewares/auth.js"

const router = Router()

const CartService = new cartManagerDB()

router.get('/:cid', auth, async (req, res) => {
    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid)
        res.render(
            "cart",
          {
            cartId: req.params.cid,
            products: result.products
          })
        } catch (error) {
            console.error("Error al obtener productos del carrito:", error.message)
            res.status(500).send({
                status: 'error',
                message: 'Error al obtener productos del carrito. Prueba más tarde.'
            })
    }
})

export default router