import { Router } from 'express'
import passport from "passport"

import UserService from "../services/userService.js";
import  auth  from '../middlewares/auth.js';
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router();

router.get('/current', passport.authenticate("jwt", { session: false }), auth, isVerified, async (req, res) => {
  try {
    const user = await userService.getUserById(req.session.user._id);
    res.status(200).send({status: 'success', message: 'User found', user});
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message});
  }
})

router.get('/users'), passport.authenticate("jwt", { session: false }), isAdmin, auth, isVerified, async (req, res, next) => {
  try {
    const users = await UserService.getUsers()
    res.status(200).send({status: 'success', message: 'usuarios encontrados', users})
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
}

router.post('/register',
  passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister' }),
  async (req, res) => {
    try {
      const result = await userManagerService.registerUser(req.body)
      res.send({
        status: "success",
        payload: result
      })
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).send({
        status: "error",
        message: "Error al registrar usuario. Por favor, intenta de nuevo más tarde."
      })
    }
  })

router.get("/failRegister", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Falla en el Registro"
  })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }),
  async (req, res) => {
    try {
      const { email, password } = req.body
      const token = await UserService.login(email, password)
      res.cookie("auth", token, { maxAge: 60 * 60 * 1000 }).send(
        {
          status: "success",
          token
        }
      )
    } catch (error) {
      res.status(400).send({
        status: error,
        message: message.error
      })
    }
  })

router.get("/failLogin", (req, res) => {
  res.redirect("/views/sessions/login")
})

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
  res.send({
    status: 'success',
    message: 'Acceso exitoso'
  })
})

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/views/sessions/login' }), async (req, res) => {
  try {
    const user = req.user
    req.session.user = user
    res.redirect('/views/carts')
  } catch (error) {
    console.error("Error al registrar usuario desde GitHub:", error)
    res.redirect('/views/sessions/login')
  }
})

router.get("/logout", async (req, res) => {
  req.clearCookie("auth")
  res.redirect("/login")
})

export default router