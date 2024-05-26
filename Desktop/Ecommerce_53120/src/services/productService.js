import { ProductManagerDB } from "../dao/productManagerDB.js"

class ProductService {

    constructor() {
        this.productDAO = ProductManagerDB.getInstance()
    }

    async getProducts(limit, page, query, sort) {
        try {
            return await this.productDAO.getAllProducts(limit, page, query, sort)
        } catch (error) {
            console.error(`Error al obtener los productos: ${error.message}`)
            throw new Error("Error al obtener los productos")
        }
    }

    async getProductById(pid) {
        try {
            return await this.productDAO.getProductByID(pid)
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${pid}: ${error.message}`)
            throw new Error(`Error al obtener el producto con ID ${pid}`)
        }
    }

    async createProduct(product) {
        try {
            return await this.productDAO.createProduct(product)
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message}`)
            throw new Error('Error al crear el producto')
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            return await this.productDAO.updateProduct(pid, productUpdate)
        } catch (error) {
            console.error(`Error al actualizar el producto ${pid}: ${error.message}`)
            throw new Error('Error al actualizar el producto')
        }
    }

    async deleteProduct(pid) {
        try {
            return await this.productDAO.deleteProduct(pid)
        } catch (error) {
            console.error(`Error al eliminar el producto ${pid}: ${error.message}`)
            throw new Error(`Error al eliminar el producto ${pid}`)
        }
    }
}

export default ProductService