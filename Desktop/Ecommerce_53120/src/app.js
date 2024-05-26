import express from 'express';
import websocket from './websocket.js';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import dotenv from 'dotenv';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import __dirname from './utils/constantsUtil.js';
import initializatePassport from './config/passportConfig.js';
import apiProductRouter from './routes/apiProductRouter.js';
import apiCartRouter from './routes/apiCartRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import usersRouter from './routes/usersRouter.js';


dotenv.config()
const app = express()

//MongoDB connect
const uri = "mongodb+srv://lucasgatto:tDM2EhNHbMihAdV4@cluster0.1npyj6s.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);

//Handlebars Config
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/../views')
app.set('view engine', 'handlebars')

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cors())
app.use(cookieParser())

//Session Middlewares
app.use(session(
    {
        store: MongoStore.create(
            {
                mongoUrl: uri,
                ttl: 20000
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
))

// Passport
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

// Linkeo al usuario con su carrito
app.get('/', async (req, res) => {
    if (req.session.user) {
      const userId = req.session.user._id
      const cart = await cartModel.findOne({user: userId}).lean()
      res.render(
        "main", {
          layout: "main",
          user: req.session.user,
          cart: cart
        }
      )
    } else {
      res.redirect('/views/sessions/login')
    }
  })

//Router respuesta tradicional / endpoint
app.use('/api', apiProductRouter)
app.use('/api', apiCartRouter)
app.use('/api/users', usersRouter)

//Router vistas de navegación
app.use('/views/products', productsRouter)
app.use("/views/carts", cartsRouter)
app.use('/views/sessions', viewsRouter) // por el momento acá guardo el Chat también

//Rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Página no encontrada")
})

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`)
})

const io = new Server(httpServer)

websocket(io)