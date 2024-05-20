import passport from "passport"
import jwt, { ExtractJwt } from "passport-jwt"
import GitHubStrategy from 'passport-github2'
import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'

import userModel from "../dao/models/userModel.js"
import { isValidPassword } from "../utils/bcrypt.js"
import userManagerDB from "../dao/userManagerDB.js"
import { cartManagerDB } from "../dao/cartManagerDB.js"


/*
App ID: 886836
Client ID: Iv1.e6f8f544378a8267
Cliente secret: d71ec3bdc55c0dee273e2ad099f67f87ab52d117

const GHCLIENT_ID = Iv1.e6f8f544378a8267;
const GHCLIENT_SECRET = d71ec3bdc55c0dee273e2ad099f67f87ab52d117;
*/

dotenv.config() //Preciso definir variables de entorno para la estrategia de autenticación de GitHub. Agrego en packege.json en SCRIPTS - START

const userManagerService = new userManagerDB()
const cartManagerService = new cartManagerDB()

const JWTStrategy = jwt.Strategy

const initializatePassport = () => {

  const GHCLIENT_ID = process.env.GHCLIENT_ID
  const GHCLIENT_SECRET = process.env.GHCLIENT_SECRET
  const JWT_SECRET = process.env.JWT_SECRET || "coderSecret"; // Define una clave secreta por defecto si no está en el archivo .env

  const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
      token = req.cookies.auth ?? null
    }
    return token
  }

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        //secretOrKey: "coderSecret"
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload)
        } catch (error) {
          return done(error)
        }
      }
    ))

  passport.use('register', new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    },
    async (req, username, password, done) => {
      const { firstName, lastName, email, age } = req.body

      try {
        const user = await userManagerService.findUserEmail(username)
        if (user) {
          return done(null, false, { message: 'El usuario ya existe' })
        }

        const newUser = {
          firstName,
          lastName,
          email,
          age,
          password
        }

        const registeredUser = await userManagerService.registerUser(newUser)
        const cart = await cartManagerService.addCart(registeredUser._id)
        const result = await userManagerService.updateUser(registeredUser._id, cart._id);

        return done(null, result)
      } catch (error) {
        console.log(error.message)
        return done(error.message)
      }
    }
  ))

  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (username, password, done) => {
      try {
        const user = await userManagerService.findUserEmail(username)
        if (!user) {
          console.log('El usuario no existe')
          return done('El usuario no existe')
        }

        if (!isValidPassword(user, password)) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
        console.log(error.message)
        return done(error.message)
      }
    }
  ))

  passport.use(
    'github',
    new GitHubStrategy({
      clientID: process.env.GHCLIENT_ID,
      clientSecret: process.env.GHCLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ username: profile._json.login })
          if (!user) {
            const newUser = {
              first_name: profile._json.name ? profile._json.name.split(' ')[0] : '',
              last_name: profile._json.name ? profile._json.name.split(' ').slice(1).join(' ') : '',
              email: profile._json.email,
              age: 18, // Propongo 18 de default, para no tener problema con la restricción colocada en Users
              password: '' // GitHub no proporciona contraseñas
            }
            const registeredUser = await userManagerService.registerUser(newUser)
            const cart = await cartManagerService.addCart(registeredUser._id)
            const result = await userManagerService.updateUser(registeredUser._id, cart._id)
            done(null, result)
          } else {
            done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    ))

  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}

export default initializatePassport