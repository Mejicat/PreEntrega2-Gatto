import {Router} from 'express'

import logged from "../middlewares/logged.js";
import CartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router()

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

//Ruta si el usuario está loggeado
router.get('/user', authRedirect, isVerified, async (req, res) => {
  const userId = req.session.user._id
  const cart = await CartService.getCart(userId)
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