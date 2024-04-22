import { Router } from 'express'
import { productManagerDB } from '../dao/productManagerDB.js'
import { uploader } from '../utils/multerUtil.js'

const router = Router()

const ProductService = new productManagerDB()

router.get('/', async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        if (!page) page = 1
        let limit = parseInt(req.query.limit) || 10
        let sort = { price: 1 }
        let query = req.query
        const result = await ProductService.getAllProducts(limit, page, query, sort)
        const baseURL = "http://localhost:8080/api/products"
        res.send({
            style: "index.css",
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: page, //utilizo la variable page que yo declaré, para contemplar el caso en que no exista esa page
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `${baseURL}?page=${result.prevPage}` : "",
            nextLink: result.nextPage ? `${baseURL}?page=${result.nextPage}` : "",
            limit,
            page,
            query,
            sort
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
        res.render("product",
            {
                style: "index.css",
                payload: result
            })
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