import ProductDto from "../dao/dto/productDTO.js";

class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            const products = await this.dao.getProducts();
            return products.map(product => new ProductDto(product));
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.dao.getProductById(pid);
            return new ProductDto(product);
        } catch (error) {
            throw new Error(`Product with ID ${pid} not found`);
        }
    }

    async addProducts(pid) {
        try {
            const product = await this.dao.addProducts(pid);        
            return new ProductDto(product);
        } catch (error) {
             throw new Error(`Could not add this Product ${pid}`);
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            await this.dao.getProductById(pid);
            const updatedProduct = await this.dao.updateProduct(pid, productUpdate);
            return new ProductDto(updatedProduct);
        } catch (error) {
            throw new Error(`Could not update this Product ${pid}`);
        }
    }

    async deleteProduct(pid) {
        try{
            const product = await this.dao.getProductById(pid);

            if (!product) {
                throw new Error(`Product ${pid} not found`);
            }
        
            const deletedProduct = await this.dao.deleteProduct(product);
            return new ProductDto(deletedProduct);
        } catch (error) {
            throw new Error(`Could not delete this Product ${pid}`);
        }
    }
}

export default ProductRepository;