import UserService from "../services/userService.js";

const userService = new UserService()

class UserController {
    constructor() {}

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers()
            res.json(users)
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error)
            res.status(500).send("Error al obtener todos los usuarios")
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id
        try {
            const user = await userService.getUserById(userId)
            res.json(user)
        } catch (error) {
            console.error(`Error al obtener el usuario con ID ${userId}:`, error)
            res.status(500).send(`Error al obtener el usuario con ID ${userId}`)
        }
    }

    async registerUser(req, res) {
        const userData = req.body;
        try {
            const newUser = await userService.registerUser(userData)
            res.status(201).json(newUser)
        } catch (error) {
            console.error("Error al registrar usuario:", error)
            res.status(500).send("Error al registrar usuario")
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const token = await userService.loginUser(email, password)
            res.cookie("auth", token, { httpOnly: true })
            res.send("Inicio de sesión exitoso")
        } catch (error) {
            console.error("Error al iniciar sesión:", error)
            res.status(401).send("Credenciales inválidas")
        }
    }

    async updateUserCart(req, res) {
        const userId = req.params.id
        const cartId = req.body.cartId
        try {
            const updatedUser = await userService.updateUserCart(userId, cartId)
            res.json(updatedUser);
        } catch (error) {
            console.error(`Error al actualizar el carrito del usuario ${userId}:`, error)
            res.status(500).send(`Error al actualizar el carrito del usuario ${userId}`)
        }
    }

    async findUserByEmail(req, res) {
        const email = req.params.email
        try {
            const user = await userService.findUserByEmail(email)
            res.json(user);
        } catch (error) {
            console.error(`Error al buscar usuario por email ${email}:`, error)
            res.status(500).send(`Error al buscar usuario por email ${email}`)
        }
    }
}

export default UserController