import { Router } from 'express';
import passport from "passport";
import jwt from 'jsonwebtoken';

import UserService from "../services/userService.js";
import auth from '../middlewares/auth.js';
import isAdmin from "../middlewares/isAdmin.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";

const router = Router();

router.get('/current', passport.authenticate("jwt", { session: false }), auth, async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user._id);
    res.status(200).send({ status: 'success', message: 'User found', user });
  } catch (error) {
    next(error);
  }
});

router.get('/users', passport.authenticate("jwt", { session: false }), isAdmin, auth, async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).send({ status: 'success', message: 'usuarios encontrados', users });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, age, password } = req.body;

    if (!firstName || !lastName || !email || !age || !password) {
      return res.status(400).send({ status: "error", message: "Todos los campos son requeridos" });
    }

    const existingUser = await UserService.findUserEmail(email);
    if (existingUser) {
      return res.status(400).send({ status: "error", message: "El usuario ya existe" });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      age,
      password: createHash(password),
    };

    const registeredUser = await UserService.registerUser(newUser);
    res.status(201).send({ status: "success", message: "Usuario registrado", user: registeredUser });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: "error", message: "Todos los campos son requeridos" });
    }

    const user = await UserService.findUserEmail(email);
    if (!user || !isValidPassword(user, password)) {
      return res.status(400).send({ status: "error", message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "coderSecret", { expiresIn: '1h' });
    res.cookie("auth", token, { maxAge: 60 * 60 * 1000 }).send({ status: "success", token });
  } catch (error) {
    next(error);
  }
});

router.get("/failRegister", (req, res) => {
  res.status(400).send({ status: "error", message: "Falla en el Registro" });
});

router.get("/failLogin", (req, res) => {
  res.redirect("/views/sessions/login");
});

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
  res.send({ status: 'success', message: 'Acceso exitoso' });
});

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/views/sessions/login' }), async (req, res) => {
  try {
    const user = req.user;
    req.session.user = user;
    res.redirect('/views/carts');
  } catch (error) {
    console.error("Error al registrar usuario desde GitHub:", error);
    res.redirect('/views/sessions/login');
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("auth");
  res.redirect("/login");
});

router.post('/', (req, res) => {
  const { first_name, last_name, age, email } = req.body;

  if (!first_name || !last_name || !email) {
    CustomError.createError({
      name: 'User creation error',
      cause: generateUserErrorInfo({ first_name, last_name, age, email }),
      message: 'Error trying to create User',
      code: ErrorCodes.INVALID_TYPES_ERROR
    });
  }

  let id = 1;
  if (users.length > 0) {
    id = users[users.length - 1].id + 1;
  }

  const newUser = { id, first_name, last_name, age, email };
  users.push(newUser);

  res.send({ status: 'success', payload: newUser });
});

export default router;
