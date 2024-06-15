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
            throw new Error(`No Products found in this cart`);
        }
    };
    
    async getProductsFromCart(cid) {
        try {
            const products = await this.dao.getProductsFromCart(cid);
            return products;
        } catch (error) {
            throw new Error(`Products not found in ${cid}`);
        }
    };
    
    async addCart(products = []) {
        try {
            const results = await this.dao.addCart(products);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`Could not add Cart`);
        }
    };
    
    async addProduct(cart, product, user) {
        try {
            const newProduct = this.dao.addProduct(cart, product, user);
            return new CartDto(newProduct);
        } catch (error) {
            throw new Error(`Could not add Product to Cart`);
        }
    };
    
    async deleteProduct(cid, pid) {
        try {
            const results = await this.dao.deleteProduct(cid, pid);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`Could not delete product ${pid}`);
        }
    };
    
    async updateProduct(cid, quantity) {
        try {
            const results = await this.dao.updateProduct(cid, quantity);
            return new CartDto(results);
        } catch (error) {
            console.log(error);
            throw new Error(`Could not update products in cart ${cid}`);
        }
    };
    
    async updateProductById(cid, pid, quantity) {
        try {
            const results = await this.dao.updateProductById(cid, pid, quantity);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`Could not update product ${pid} in ${cid}`);
        }
    };
    
    async deleteAllProducts(cid) {
        try {
            const results = await this.dao.deleteAllProducts(cid);
            return new CartDto(results);
        } catch (error) {
            throw new Error(`Could not delete products on ${cid}`);
        }
    };

    async getStockfromProducts(cid) {
        try {
            const results = await this.dao.getStockfromProducts(cid);
            return results;
        } catch (error) {
            throw new Error(`Could not add products to ${cid}`);
        }
    };
}

export default CartRepository;