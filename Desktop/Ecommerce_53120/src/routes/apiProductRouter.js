import { Router } from 'express'
import { productManagerDB } from '../dao/productManagerDB.js'
import { uploader } from '../utils/multerUtil.js'

const router = Router()

const ProductService = new productManagerDB()

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
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const result = await ProductService.getProductByID(req.params.pid)
        res.send({product})
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        })
    }
    try {
        const result = await ProductService.createProduct(req.body)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => { //Añado hasta 3 fotos para el producto
    if (req.files) {
        req.body.thumbnails = []
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename)
        });
    }
    try {
        const result = await ProductService.updateProduct(req.params.pid, req.body)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router