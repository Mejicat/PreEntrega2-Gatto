import productModel from './models/productModel.js'

class ProductManagerDB {

    constructor() { }

    static getInstance() {
        if (!ProductManagerDB.instance) {
            ProductManagerDB.instance = new ProductManagerDB()
            ProductManagerDB.instance.productModel = new productModel()
        }
        return ProductManagerDB.instance
    }

    async getAllProducts(limit, page, query, sort) {
        try {
            return await productModel.paginate(query, { limit, page, sort, lean: true })
        } catch (error) {
            console.error(`Error al buscar los productos: ${error.message}`)
            throw new Error("Error al buscar los productos")
        }
    }

    async getProductByID(pid) {
        try {
            const product = await this.productModel.findOne({ _id: pid })

            if (!product) throw new Error(`El producto ${pid} no existe!`)

            return product
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${pid}: ${error.message}`)
            throw new Error(`Error al obtener el producto con ID ${pid}`)
        }
    }

    async createProduct(product) {
        const { title, description, code, price, stock, category, thumbnails } = product

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto')
        }

        try {
            const result = await this.productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [] })
            return result
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message}`)
            throw new Error('Error al crear el producto')
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await this.productModel.updateOne({ _id: pid }, productUpdate)

            if (result.nModified === 0) throw new Error(`No se encontró el producto ${pid} para actualizar`)

            return result
        } catch (error) {
            console.error(`Error al actualizar el producto ${pid}: ${error.message}`)
            throw new Error('Error al actualizar el producto')
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await this.productModel.deleteOne({ _id: pid })

            if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`)

            return result
        } catch (error) {
            console.error(`Error al eliminar el producto ${pid}: ${error.message}`)
            throw new Error(`Error al eliminar el producto ${pid}`)
        }
    }
}

export { ProductManagerDB }