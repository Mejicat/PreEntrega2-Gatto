import UserManagerDB from "../dao/userManagerDB.js"

class UserService {

    constructor() {
        this.userDAO = UserManagerDB.getInstance()
    }

    async getAllUsers() {
        try {
            return await this.userDAO.getAllUsers()
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error)
            throw new Error("Error al obtener todos los usuarios")
        }
    }

    async getUserById(uid) {
        try {
            return await this.userDAO.getUser(uid)
        } catch (error) {
            console.error(`Error al obtener el usuario con ID ${uid}:`, error)
            throw new Error(`Error al obtener el usuario con ID ${uid}`)
        }
    }

    async registerUser(user) {
        try {
            return await this.userDAO.registerUser(user)
        } catch (error) {
            console.error("Error al registrar usuario:", error)
            throw new Error("Error al registrar usuario")
        }
    }

    async loginUser(email, password) {
        try {
            return await this.userDAO.login(email, password)
        } catch (error) {
            console.error("Error al intentar hacer login:", error)
            throw new Error("Error al intentar hacer login")
        }
    }

    async updateUserCart(userId, cartId) {
        try {
            return await this.userDAO.updateUser(userId, cartId)
        } catch (error) {
            console.error(`Error al actualizar el carrito del usuario ${userId}:`, error)
            throw new Error(`Error al actualizar el carrito del usuario ${userId}`)
        }
    }

    async findUserByEmail(email) {
        try {
            return await this.userDAO.findUserEmail(email)
        } catch (error) {
            console.error("Error al buscar usuario por email:", error)
            throw new Error("Error al buscar usuario por email")
        }
    }
}

export default UserService
