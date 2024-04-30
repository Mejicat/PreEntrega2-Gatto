import { isValidPassword } from "../utils/bcrypt.js"
import userModel from "./models/userModel.js"

export default class userManagerDB {
  async getUsers() {
    try {
      const result = await userModel.find({}).populate('cart').populate('cart.products.product')
      return result
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw error
    }
  }

  async registerUser(user) {
    try {
      if (user.email == "adminCoder@coder.com" && isValidPassword(user, 'adminCod3r123')) {
        const result = await userModel.create(user)
        result.role = "admin"
        result.save()
        return result
      }
      const result = await userModel.create(user) //si el usuario no es el admin, lo guardo en la DB
      return result
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      throw error
    }
  }

  async updateUser(userId, cartId) {
    try {
      const result = await userModel.findByIdAndUpdate(userId, { cart: cartId })
      return result
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      throw error
    }
  }

  async findUserEmail(email) {
    try {
      const result = await userModel.findOne({ email: email })
      return result
    } catch (error) {
      console.error("Error al buscar usuario por email:", error)
      throw error
    }
  }
}