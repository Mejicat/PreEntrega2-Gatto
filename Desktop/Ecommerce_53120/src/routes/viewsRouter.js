import {Router} from 'express'
import messageManagerDB from "../dao/messageManagerDB.js"
import { auth } from "../middlewares/auth.js"
import { logged } from "../middlewares/logged.js"
import { cartModel } from '../dao/models/cartModel.js'

const router = Router()

const messageService = new messageManagerDB()

//Rutas públicas
router.get('/login', logged, async (req, res) => {
  if (req.session.user) {
    return res.redirect('/views/carts') // redirige si ya hay una sesión activa
  }
  res.render(
    "login",
    {
      loginFailed: req.session.failLogin ?? false
    }
  )
})
  
router.get('/register', logged, async (req, res) => {
  if (req.session.user) {
    return res.redirect('/views/carts') // redirige si ya hay una sesión activa
  }
  res.render(
    'register', 
    {
      registerFailed: req.session.failRegister ?? false
    })
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

export default router;