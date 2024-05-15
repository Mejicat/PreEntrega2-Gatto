import { Router } from 'express'
import userManagerDB from "../dao/userManagerDB.js"
import passport from "passport"
import { auth } from '../middlewares/auth.js'

const router = Router()

const userManagerService = new userManagerDB()

router.get('/users', async (req, res) => {
  try {
    const result = await userManagerService.getUsers()
    res.send({ users: result })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})

router.get('/current', passport.authenticate("jwt", { session: false }), async (req, res) => {
  if (req.session.user) {
    res.status(200).send({
      status: 'success',
      user: req.session.user
    })
  } else {
    res.status(400).send({
      status: 'error',
      message: "Usuario no encontrado"
    })
  }
})

router.get('/:uid'), passport.authenticate("jwt", { session: false }), (req, res, next) => {

  if (req.user.role === "admin") return next()
  res.status(403).send({
    status: "error",
    message: "Unauthorized"
  })
}, async (req, res) => {
  try {
    const result = await userManagerService.getUser(req.params.uid)
    res.send({
      status: "success",
      payload: result
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
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
      const token = await userManagerService.login(email, password)
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
    const email = req.user.email
    const result = await userManagerService.registerUser({ email })
    req.session.user = req.user
    res.redirect('/views/carts')
  } catch (error) {
    console.error("Error al registrar usuario desde GitHub:", error)
    res.redirect('/views/sessions/login')
  }
})

router.get("/logout", async (req, res) => {
  req.clearCookie ("auth")
  res.redirect("/login")
})

export default router