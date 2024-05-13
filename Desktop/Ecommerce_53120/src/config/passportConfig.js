import passport from "passport"
import jwt, { ExtractJwt } from "passport-jwt"
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
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
        secretOrKey: "coderSecret"
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload)
        } catch (error) {
          return done(error)
        }
      }
    ))

  /*passport.use('login', new JWTStrategy(
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
  ))*/

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
              username: profile._json.login,
              name: profile._json.name,
              password: ''
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