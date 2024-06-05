import ProductDAO from "../dao/productDAO.js";
import ProductDTO from "../dao/dto/productDTO.js";

class ProductService {

    async getProducts(limit, page, query, sort) {
        try {
          const products = await ProductDAO.getProducts(limit, page, query, sort)
          if (!products) {
            throw new Error("No se encontraron productos")
          }
          return products
        } catch (error) {
          throw error
        }
      }
    
      async getProductById(id) {
        try {
          const product = await ProductDAO.getProductById(id)
          if (!product) {
            throw new Error("Product not found")
          }
          return new ProductDTO(product)
        } catch (error) {
          throw error
        }
      }
    
      async addProduct(productData) {
        try {
          const product = await ProductDAO.addProduct(productData)
          if (!product) {
            throw new Error("Error al agregar producto")
          }
          return new ProductDTO(product);
        } catch (error) {
          throw error
        }
      }
    
      async updateProduct(id, updatedFields) {
        try {
          const product = await ProductDAO.updateProduct(id, updatedFields)
          if (!product) {
            throw new Error("Error al actualizar el producto")
          }
          return new ProductDTO(product)
        } catch (error) {
          throw error
        }
      }
    
      async deleteProduct(id) {
        try {
          const product = await ProductDAO.deleteProduct(id)
          if (!product) {
            throw new Error("Error al borrar el producto")
          }
          return new ProductDTO(product)
        } catch (error) {
          throw error
        }
      }
    }
    
export default ProductService