import {Router} from 'express'
import userModel from '../dao/models/userModel.js'
import userManagerDB from "../dao/userManagerDB.js"
import {cartManagerDB} from "../dao/cartManagerDB.js"

const router = Router()

const userManagerService = new userManagerDB()
const cartManagerService = new cartManagerDB()

router.get('/users', async (req, res) => {
    try {
      const result = await userManagerService.getUsers()
      res.send({users: result})
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  })

router.post("/register", async (req, res) => {
    const user = req.body
    try {
      const response = await userManagerService.registerUser(user)
      const cart = await cartManagerService.addCart(response._id)
      //Asocio el carrito al usuario
      await userManagerService.updateUser(response._id, cart._id)
      res.redirect('/')
    } catch (error) {
      console.error(error)
      res.redirect('/register')
    }
  })

router.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false
        const result = await userModel.findOne({email: req.body.email}); //busco al usuario por su mail
        if (!result) {
            req.session.failLogin = true
            return res.redirect("/login")
        }

        if (req.body.password !== result.password) {
            req.session.failLogin = true
            return res.redirect("/login")
        }

        delete result.password
        req.session.user = result //guardo todos sus datos, excepto la contraseña

        return res.redirect("/")
    } catch (e) {
        req.session.failLogin = true
        return res.redirect("/login")
    }
})

router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        res.redirect('/login')
    })
  })

export default router;