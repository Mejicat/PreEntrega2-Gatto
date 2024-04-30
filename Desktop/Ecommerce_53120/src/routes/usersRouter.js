import { Router } from 'express'
import userManagerDB from "../dao/userManagerDB.js"
import passport from "passport"

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

router.post('/register',
  passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister' }),
  async (req, res) => {
    res.redirect('/login')
  }
);

router.get("/failRegister", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Falla en el Registro"
  })
})


router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }),
  async (req, res) => {
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role 
    }
    res.redirect('/')
  }
)

router.get("/failLogin", (req, res) => {
  res.status(400).send({
      status: "error",
      message: "Falla en el Login"
  })
})

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.send({
      status: 'success',
      message: 'Acceso exitoso'
  })
})

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = req.user
  res.redirect('/')
})

router.post("/logout", (req, res) => {
  req.session.destroy(error => {
    res.redirect('/login')
  })
})

export default router;