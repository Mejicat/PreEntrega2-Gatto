import { cartModel } from './models/cartModel.js'

class cartManagerDB {
    async getAllCarts() {
        try {
            return await cartModel.find().lean()
        } catch (error) {
            console.error(error.message)
            throw new Error("Error al buscar los carritos")
        }
    }

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

    async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] })
            return newCart;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al crear el carrito')
        }
    }

    async addProductByID(cid, pid) {
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
    }
}

export { cartManagerDB }
