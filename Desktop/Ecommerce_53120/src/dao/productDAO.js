import  productModel from './models/productModel.js';

class ProductDAO {
    static instance = null;

    constructor() {
        if (!ProductDAO.instance) {
            ProductDAO.instance = this;
        }
        return ProductDAO.instance;
    }

    static getInstance() {
        if (!ProductDAO.instance) {
            ProductDAO.instance = new ProductDAO();
        }
        return ProductDAO.instance;
    }

    async getProducts(limit, page, query, sort) {
        try {
            return await productModel.paginate(query, { limit, page, sort, lean: true });
        } catch (error) {
            console.error(`Error al buscar los productos: ${error.message}`);
            throw new Error("Error al buscar los productos");
        }
    }

    async getProductById(pid) {
        try {
            const product = await productModel.findOne({ _id: pid });

            if (!product) throw new Error(`El producto ${pid} no existe!`);

            return product;
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${pid}: ${error.message}`);
            throw new Error(`Error al obtener el producto con ID ${pid}`);
        }
    }

    async addProducts(pid) {
        const { title, description, code, price, stock, category, thumbnails } = pid;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto');
        }

        try {
            const result = await productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [] });
            return result;
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message}`);
            throw new Error('Error al crear el producto');
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await productModel.updateOne({ _id: pid }, productUpdate);

            if (result.nModified === 0) throw new Error(`No se encontró el producto ${pid} para actualizar`);

            return result;
        } catch (error) {
            console.error(`Error al actualizar el producto ${pid}: ${error.message}`);
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await productModel.deleteOne({ _id: pid });

            if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);

            return result;
        } catch (error) {
            console.error(`Error al eliminar el producto ${pid}: ${error.message}`);
            throw new Error(`Error al eliminar el producto ${pid}`);
        }
    }
}

export default ProductDAO;
