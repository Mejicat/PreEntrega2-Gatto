import cartManagerDB from "../dao/cartManagerDB.js"

class CartService {

    constructor() {
        this.cartDao = cartManagerDB.getInstance()
    }

    async createCart() {
        try {
            const cart = await this.cartDao.addCart()
            return cart;
        } catch (error) {
            console.error("Error al crear el carrito:", error.message)
            throw new Error("Error al crear el carrito")
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.cartDao.getCart(cartId)
            if (!cart) {
                throw new Error(`El carrito con id ${cartId} no existe`)
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message)
            throw new Error("Error al obtener el carrito")
        }
    }

    async getAllCarts() {
        try {
            const carts = await this.cartDao.getAllCarts()
            return carts;
        } catch (error) {
            console.error("Error al obtener los carritos:", error.message)
            throw new Error("Error al obtener los carritos")
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.cartDao.addProductToCart(cartId, productId, quantity)
            return cart;
        } catch (error) {
            console.error(`Error al agregar el producto ${productId} al carrito ${cartId}:`, error.message)
            throw new Error("Error al agregar el producto al carrito")
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const result = await this.cartDao.updateProductQuantity(cartId, productId, quantity)
            return result
        } catch (error) {
            console.error(`Error al actualizar la cantidad del producto ${productId} en el carrito ${cartId}:`, error.message)
            throw new Error("Error al actualizar la cantidad del producto en el carrito")
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const result = await this.cartDao.deleteProductFromCart(cartId, productId)
            return result
        } catch (error) {
            console.error(`Error al eliminar el producto ${productId} del carrito ${cartId}:`, error.message)
            throw new Error("Error al eliminar el producto del carrito")
        }
    }

    async emptyCart(cartId) {
        try {
            await this.cartDao.deleteAllProductsFromCart(cartId)
        } catch (error) {
            console.error(`Error al vaciar el carrito ${cartId}:`, error.message)
            throw new Error("Error al vaciar el carrito")
        }
    }

    async deleteCart(cartId) {
        try {
            await this.cartDao.deleteCart(cartId)
        } catch (error) {
            console.error(`Error al eliminar el carrito ${cartId}:`, error.message)
            throw new Error("Error al eliminar el carrito")
        }
    }
}

export default CartService
