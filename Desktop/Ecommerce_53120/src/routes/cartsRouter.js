import { Router } from 'express'

import CartDAO from '../dao/cartDAO.js'
import  authRedirect  from "../middlewares/authRedirect.js"
import isVerified from '../middlewares/isVerified.js'

const router = Router()

const CartService = new CartDAO()

router.get('/:cid', authRedirect, isVerified, async (req, res) => {
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