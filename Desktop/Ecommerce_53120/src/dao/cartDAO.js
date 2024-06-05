import { cartModel } from './models/cartModel.js'

export default class CartDAO {

    constructor() {}

    static getInstance() {
        if (!CartDAO.instance) {
            CartDAO.instance = new CartDAO()
            CartDAO.instance.cartModel = new cartModel()
        }
        return CartDAO.instance
    }

    async addCart() {
        try {
            const cart = await this.cartModel.create({})
            return cart
        } catch (error) {
            console.error(error)
        }
    }

    async getCart(id) {
        try {
            const cart = await this.cartModel.findById(id).populate('products.product').lean();
            if (!cart) {
                console.error('Carrito no encontrado')
                return
            }
            return cart
        } catch (error) {
            console.error(error)
        }
    }

    async getAllCarts() {
        try {
            return await this.cartModel.find().populate('products.product').lean()
        } catch (error) {
            console.error(error.message)
            throw new Error("Error al buscar los carritos")
        }
    }

    async updateCart(cartId, products) {
        try {
            return await this.cartModel.findByIdAndUpdate(cartId, { products: products })
        } catch (error) {
            console.error(error)
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return this.cartModel.updateOne(
                { "_id": cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } }
            )
        } catch (error) {
            console.error(error)
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.cartModel.findOne({ _id: cartId })
            if (!cart) {
                throw new Error(`El carrito ${cartId} no existe`)
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId)
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity })
            }

            const updatedCart = await cart.save()
            return updatedCart;
        } catch (error) {
            console.error(`Error al agregar el producto ${productId} al carrito ${cartId}: ${error.message}`)
            throw new Error("Error al agregar el producto al carrito")
        }
    }


    async getProductsFromCartByID(cid) {
        try {
            const cart = await this.cartModel.findOne({ _id: cid }).populate('products.product').lean()

            if (!cart) throw new Error(`El carrito ${cid} no existe!`);

            return cart.products;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al obtener los productos del carrito ${cid}`)
        }
    }

    async deleteCart(id) {
        try {
            return await this.cartModel.deleteOne({ _id: id })
        } catch (error) {
            console.error(error)
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            await this.cartModel.findByIdAndUpdate(cartId, { products: [] })
        } catch (error) {
            console.error(error)
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            return await this.cartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
            )
        } catch (error) {
            console.error(error)
        }
    }
}
