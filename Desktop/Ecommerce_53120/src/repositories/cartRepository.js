import CartDto from "../dao/dto/cartDTO.js";

class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts() {
        try {
            const carts = await this.dao.getCarts();
            return carts.map(cart => new CartDto(cart));
        } catch (error) {
            throw new Error(`No se encontraron carritos`);
        }
    }

    async getCart(cid) {
        try {
            const cart = await this.dao.getCart(cid);
            return new CartDto(cart);
        } catch (error) {
            throw new Error(`Carrito con ID ${cid} no encontrado`);
        }
    }

    async getProductsFromCart(cid) {
        try {
            const products = await this.dao.getProductsFromCart(cid);
            return products;
        } catch (error) {
            throw new Error(`Productos no encontrados en el carrito ${cid}`);
        }
    }

    async addCart(userId) {
        try {
            const results = await this.dao.addCart(userId);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`No se pudo agregar el carrito`);
        }
    }

    async addProduct(cart, product, user) {
        try {
            const newProduct = await this.dao.addProduct(cart, product, user);
            return new CartDto(newProduct);
        } catch (error) {
            throw new Error(`No se pudo agregar el producto al carrito`);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const results = await this.dao.deleteProductFromCart(cid, pid);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`No se pudo eliminar el producto ${pid} del carrito`);
        }
    }

    async updateProduct(cid, quantity) {
        try {
            const results = await this.dao.updateProduct(cid, quantity);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`No se pudo actualizar los productos en el carrito ${cid}`);
        }
    }

    async updateProductById(cid, pid, quantity) {
        try {
            const results = await this.dao.updateProductById(cid, pid, quantity);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`No se pudo actualizar el producto ${pid} en el carrito ${cid}`);
        }
    }

    async deleteAllProducts(cid) {
        try {
            const results = await this.dao.deleteAllProducts(cid);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`No se pudieron eliminar los productos del carrito ${cid}`);
        }
    }

    async getStockfromProducts(cid) {
        try {
            const results = await this.dao.getStockfromProducts(cid);
            return results;
        } catch (error) {
            throw new Error(`No se pudo obtener el stock de los productos en el carrito ${cid}`);
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await this.dao.updateCart(cid, products);
            return new CartDto(cart);
        } catch (error) {
            throw new Error(`No se pudo actualizar el carrito ${cid}`);
        }
    }

    async clearCart(cid) {
        try {
            const cart = await this.dao.clearCart(cid);
            return new CartDto(cart);
        } catch (error) {
            throw new Error(`No se pudo limpiar el carrito ${cid}`);
        }
    }
}

export default CartRepository;
