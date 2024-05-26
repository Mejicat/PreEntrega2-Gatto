import ProductService from "../services/productService.js";

const productService = new ProductService()

class ProductController {
    constructor() {}

    async getProducts(req, res) {
        try {
            const { limit, page, query, sort } = req.query
            const products = await productService.getProducts(limit, page, query, sort)
            res.json(products)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params
            const product = await productService.getProductById(pid)
            res.json(product)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async createProduct(req, res) {
        try {
            const product = req.body;
            const newProduct = await productService.createProduct(product)
            res.status(201).json(newProduct)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params
            const productUpdate = req.body
            const updatedProduct = await productService.updateProduct(pid, productUpdate)
            res.json(updatedProduct)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const result = await productService.deleteProduct(pid)
            res.json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export { ProductController }
