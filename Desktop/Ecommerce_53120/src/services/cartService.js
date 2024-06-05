import CartDAO from "../dao/cartDAO.js";
import CartDTO from "../dao/dto/cartDTO.js";

class CartService {
    async addCart(userId) {
        try {
          const cart = await CartDAO.getCartWithUserId(userId)
          if (cart) {
            return new CartDTO(cart)
          }
          const newCart = await CartDAO.addCart(userId)
          if (!newCart) {
            throw new Error('Error creating cart')
          }
          return new CartDTO(newCart)
        } catch (error) {
          throw error
        }
      }
    
      async getCart(id) {
        try {
          const cart = await CartDAO.getCart(id)
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async getCartWithUserId(userId) {
        try {
          const cart = await CartDAO.getCartWithUserId(userId)
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async getAllCarts() {
        try {
          const carts = await CartDAO.getAllCarts()
          if (!carts) {
            throw new Error('No carts found')
          }
          return carts.map((cart) => new CartDTO(cart))
        } catch (error) {
          throw error
        }
      }
    
      async updateProductQuantity(cartId, productId, quantity) {
        try {
          const cart = await CartDAO.updateProductQuantity(cartId, productId, quantity)
          if (!cart) {
            throw new Error('Error updating product quantity')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async addProductToCart(cartId, productId, quantity) {
        try {
          const cart = await CartDAO.addProductToCart(cartId, productId, quantity)
          if (!cart) {
            throw new Error('Error adding product to cart')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async deleteProductFromCart(cartId, productId) {
        try {
          const cart = CartDAO.deleteProductFromCart(cartId, productId)
          if (!cart) {
            throw new Error('Error deleting product from cart')
          }
          return new CartDTO(cart);
        } catch (error) {
          throw error
        }
      }
      
      async deleteAllProductsFromCart(cartId) {
        try {
          const cart = CartDAO.deleteAllProductsFromCart(cartId)
          if (!cart) {
            throw new Error('Error deleting products from cart')
          }
          return new CartDTO(cart);
        } catch (error) {
          throw error
        }
      }
      
      async deleteCart(id) {
        try {
          const cart = await CartDAO.deleteCart(id)
          if (!cart) {
            throw new Error('Error deleting cart')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    }
    
  export default new CartService()