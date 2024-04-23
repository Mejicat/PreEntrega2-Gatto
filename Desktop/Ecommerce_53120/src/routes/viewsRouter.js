import {Router} from 'express'
import messageManagerDB from "../dao/messageManagerDB.js"
import { auth } from "../middlewares/auth.js"
import { cartModel } from '../dao/models/cartModel.js'

const router = Router()

const messageService = new messageManagerDB()

//Ruta si el usuario está loggeado
router.get('/user', auth, async (req, res) => {
    const userId = req.session.user._id
    const cart = await cartModel.findOne({user: userId}).lean()
    res.render(
      "user",
      {
        layout: "main",
        user: req.session.user,
        cart: cart //me traigo su cart
      }
    )
  })

//Rutas públicas
router.get('/login', async (req, res) => {
    if (req.session.user) {
      res.redirect('/user')
    }
    res.render(
      "login",
      {
        //layout: 'login',
        loginFailed: req.session.failLogin
      }
    )
  })
  
  router.get('/register', async (req, res) => {
    if (req.session.user) {
      res.redirect('/user')
    }
    res.render(
      'register',
      {
       // layout: 'register',
      }
    )
  })

router.get("/chat", async (req, res) => {
    try {
        const messages = await messageService.getAllMessages()
        res.render("chat", {
            title: "Chat",
            style: "index.css",
            messages: messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error")
    }
})

export default router;