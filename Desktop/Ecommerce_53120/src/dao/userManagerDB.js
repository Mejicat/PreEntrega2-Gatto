import jwt from "jsonwebtoken"

import { isValidPassword } from "../utils/bcrypt.js"
import userModel from "./models/userModel.js"

export default class userManagerDB {
  async getAllUsers() {
    try {
      return await userModel.find({}).populate('cart').populate('cart.products.product')
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      throw new Error("Error al consultar usuarios")
    }
  }

  async getUser(uid) {
    try {
      return await userModel.find({ _id: uid }).populate('cart').populate('cart.products.product')
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      throw new Error("Usuario inexistente")
    }
  }


  async registerUser(user) {
    const { first_name, last_name, email, age, password } = user

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Error al registrar el usuario")
    }

    try {
      const newUser = await userModel.create({ first_name, last_name, email, age, password })
      if (user.email == "adminCoder@coder.com" && isValidPassword(user, 'adminCod3r123')) {
        newUser.role = "admin"
        await newUser.save()
      }
      return "Usuario registrado correctamente"
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      throw error
    }
  }

  async login(email, password) {

    if (!email || !password) {
      throw new Error("Datos de acceso inválidos. Verificar e reintentar nuevamente.")
    }

    try {
      const user = await userModel.findOne({ email }).lean()
      if (!user) throw new Error("Credenciales inválidas")
      if (isValidPassword(user, password)) {
        delete user.password
        return jwt.sign(user, "coderSecret", {expiresIn: "1h"})
      }

      throw new Error("Credenciales inválidas")
    }

    catch (error) {
      console.error("Error al intentar hacer login:", error)
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