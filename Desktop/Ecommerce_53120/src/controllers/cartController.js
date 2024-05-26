import CartService from "../services/cartService.js";

const myCart = new CartService()

class CartController {
    constructor() {}

    async createCart(req, res) {
        try {
            const cart = await myCart.createCart()
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getCartById(req, res) {
        const { id } = req.params
        try {
            const cart = await myCart.getCartById(id)
            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await myCart.getAllCarts()
            res.status(200).json(carts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async addProductToCart(req, res) {
        const { cartId, productId } = req.params
        const { quantity } = req.body
        try {
            const updatedCart = await myCart.addProductToCart(cartId, productId, quantity)
            res.status(200).json(updatedCart)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async updateProductQuantity(req, res) {
        const { cartId, productId } = req.params
        const { quantity } = req.body
        try {
            const result = await myCart.updateProductQuantity(cartId, productId, quantity)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async removeProductFromCart(req, res) {
        const { cartId, productId } = req.params
        try {
            const result = await myCart.removeProductFromCart(cartId, productId)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async emptyCart(req, res) {
        const { cartId } = req.params
        try {
            await myCart.emptyCart(cartId)
            res.status(200).json({ message: "Carrito vaciado correctamente" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async deleteCart(req, res) {
        const { cartId } = req.params
        try {
            await myCart.deleteCart(cartId)
            res.status(200).json({ message: "Carrito eliminado correctamente" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default CartController
