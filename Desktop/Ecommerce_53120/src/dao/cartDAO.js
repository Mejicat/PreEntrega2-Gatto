import { cartModel } from './models/cartModel.js';

class CartDAO {
    static instance = null;

    constructor() {
        if (!CartDAO.instance) {
            CartDAO.instance = this;
        }
        return CartDAO.instance;
    }

    static getInstance() {
        if (!CartDAO.instance) {
            CartDAO.instance = new CartDAO();
        }
        return CartDAO.instance;
    }

    async addCart() {
        try {
            const cart = await cartModel.create({});
            return cart;
        } catch (error) {
            console.error(error);
        }
    }

    async getCart(cid) {
        try {
            const cart = await cartModel.findById(cid).populate('products.product').lean();
            if (!cart) {
                console.error('Carrito no encontrado');
                return;
            }
            return cart;
        } catch (error) {
            throw new Error(`Carrito con ID ${cid} no encontrado`);
        }
    }

    async getAllCarts() {
        try {
            return await cartModel.find().populate('products.product').lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los carritos");
        }
    }

    async updateCart(cid, products) {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
            return updatedCart;
        } catch (error) {
            throw new Error(`No se pudo actualizar el carrito ${cid}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return cartModel.updateOne(
                { "_id": cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } }
            );
        } catch (error) {
            console.error(error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
            if (!cart) {
                throw new Error(`El carrito ${cartId} no existe`);
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.error(`Error al agregar el producto ${productId} al carrito ${cartId}: ${error.message}`);
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async getProductsFromCartByID(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid }).populate('products.product').lean();

            if (!cart) throw new Error(`El carrito ${cid} no existe!`);

            return cart.products;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al obtener los productos del carrito ${cid}`);
        }
    }

    async deleteCart(id) {
        try {
            return await cartModel.deleteOne({ _id: id });
        } catch (error) {
            console.error(error);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
            );
        } catch (error) {
            console.error(error);
        }
    }

    async clearCart(cid) {
        try {
            const clearedCart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
            return clearedCart;
        } catch (error) {
            throw new Error(`No se pudo limpiar el carrito ${cid}`);
        }
    }
}

export default CartDAO;
