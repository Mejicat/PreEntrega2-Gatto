import { cartModel } from './models/cartModel.js'

class cartManagerDB {

    async addCart() {
        try {
            const cart = await cartModel.create({})
            return cart
        } catch (error) {
            console.error(error)
        }
    }

    async getCart(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product').lean();
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
            return await cartModel.find().lean()
        } catch (error) {
            console.error(error.message)
            throw new Error("Error al buscar los carritos")
        }
    }

    async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] })
            return newCart;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al crear el carrito')
        }
    }

    async updateCart(cartId, products) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: products })
        } catch (error) {
            console.error(error)
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return cartModel.updateOne(
                { "_id": cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } }
            )
        } catch (error) {
            console.error(error)
        }
    }

    async addProductToCart(cartid, productId, quantity = 1) {
        try {
            const cart = await cartModel.findOne({ _id: cartid });
            if (!cart) {
                return console.error(error)
            }

            const existingProduct = await cartModel.findOne({ "products.product": productId })
            if (existingProduct) {
                await cartModel.updateOne(
                    { "products.product": productId },
                    { $inc: { "products.$.quantity": 1 } }
                )
            } else {
                await cartModel.updateOne(
                    { _id: cartid },
                    { $push: { products: [{ product: productId, quantity: quantity }] } }
                )
            }
        } catch (error) {
            console.error(error)
        }
    }
    /*async addProductByID(cid, pid) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid },
                { $addToSet: { products: { product: pid } } },
                { new: true }
            ).populate('products.product').lean()

            if (!cart) throw new Error(`El carrito ${cid} no existe!`)

            return cart;
        } catch (error) {
            console.error(error.message)
            throw new Error('Error al agregar producto al carrito')
        }
    }*/

    async getProductsFromCartByID(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid }).populate('products.product').lean()

            if (!cart) throw new Error(`El carrito ${cid} no existe!`);

            return cart.products;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al obtener los productos del carrito ${cid}`)
        }
    }

    async deleteCart(id) {
        try {
            return await cartModel.deleteOne({ _id: id })
        } catch (error) {
            console.error(error)
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            await cartModel.findByIdAndUpdate(cartId, { products: [] })
        } catch (error) {
            console.error(error)
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
            )
        } catch (error) {
            console.error(error)
        }
    }



}

export { cartManagerDB }
