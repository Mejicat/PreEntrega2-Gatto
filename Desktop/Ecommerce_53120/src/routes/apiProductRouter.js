import express from 'express';
import { ProductController } from '../controllers/productController.js';

const router = express.Router()
const productController = new ProductController()

router.get('/products', (req, res) => productController.getProducts(req, res))
router.get('/products/:pid', (req, res) => productController.getProductById(req, res))
router.post('/products', (req, res) => productController.createProduct(req, res))
router.put('/products/:pid', (req, res) => productController.updateProduct(req, res))
router.delete('/products/:pid', (req, res) => productController.deleteProduct(req, res))

router.get('/', async (req, res) => {
    let { limit, page, sort, category, status } = req.query
    let sortOptions
    try {
        if (sort == "asc") {
            sortOptions = { price: 1 }
        } else if (sort == "desc") {
            sortOptions = { price: -1 }
        } else {
            sortOptions = {}
        }
        let filter
        if (category) {
            filter = { category: category }
        } else if (status) {
            filter = { status: status }
        } else {
            filter = {}
        }
        const result = await ProductService.getAllProducts(filter, { limit: limit ? limit : 10, page: page ? page : 1, sort: sortOptions })
        const baseURL = "http://localhost:8080/api/products"
        res.send({
            style: "index.css",
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page, 
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `${baseURL}?page=${result.prevPage}` : "",
            nextLink: result.nextPage ? `${baseURL}?page=${result.nextPage}` : ""
        })
    } catch (error) {
        console.error("Error al obtener productos:", error.message)
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener productos. Prueba más tarde.'
        })
    }
})



export default router