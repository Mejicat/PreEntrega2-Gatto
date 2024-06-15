import express from 'express';
import websocket from './websocket.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import dotenv from 'dotenv';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import flash from 'connect-flash';
import compression from 'express-compression';
import connectToMongo from './dao/connection.js';

import __dirname from './utils/constantsUtil.js';
import initializatePassport from './config/passportConfig.js';
import apiProductRouter from './routes/apiProductRouter.js';
import apiCartRouter from './routes/apiCartRouter.js';
import apiMessageRouter from './routes/apiMessageRouter.js';
import apiTicketsRouter from './routes/apiTicketRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import usersRouter from './routes/usersRouter.js';
import chatRouter from './routes/chatRouter.js';
import errorHandler from './middlewares/errors/index.js';

dotenv.config();
const app = express();

const initializeApp = async () => {
    // Conectar a MongoDB
    const mongoClient = await connectToMongo();

    // Handlebars Config
    app.engine('handlebars', handlebars.engine());
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'handlebars');

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cors());
    app.use(cookieParser());
    app.use(flash());
    app.use(compression({
        brotli: { enable: true, zlib: {} }
    }));

    // Session Middlewares
    app.use(session({
        store: MongoStore.create({
            client: mongoClient,
            ttl: 20000
        }),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }));

    // Passport
    initializatePassport();
    app.use(passport.initialize());
    app.use(passport.session());

    // Linkeo al usuario con su carrito
    app.get('/', async (req, res) => {
        if (req.session.user) {
            const userId = req.session.user._id;
            const cart = await cartModel.findOne({ user: userId }).lean();
            res.render("main", {
                layout: "main",
                user: req.session.user,
                cart: cart
            });
        } else {
            res.redirect('/views/sessions/login');
        }
    });

    // Router respuesta tradicional / endpoint
    app.use('/api', apiProductRouter);
    app.use('/api', apiCartRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/messages', apiMessageRouter);
    app.use('/api/tickets', apiTicketsRouter);

    // Router vistas de navegación
    app.use('/views/products', productsRouter);
    app.use("/views/carts", cartsRouter);
    app.use('/views/sessions', viewsRouter);
    app.use('/chat', chatRouter);

    // Rutas no encontradas
    app.use((req, res, next) => {
        res.status(404).send("Página no encontrada");
    });

    // Manejo de errores
    app.use(errorHandler);

    // Envío de e-mail
    const transport = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    app.get('/send/mail', async (req, res) => {
        try {
            const result = await transport.sendMail({
                from: 'Lucas Gatto <lucas.gatto@recargapay.com>',
                to: 'german@tutor.com',
                subject: 'Envío de Repo de Corrección',
                html: ` <div>
                          <h1>https://github.com/Mejicat/CalculadoraRendimientoCDI-Gatto/tree/53120/primera_practica_integradora</h1>
                      </div>`
            });

            res.send({ status: 'success', result });
        } catch (error) {
            console.log(error.message);
            res.status(500).send({ status: 'error', message: 'Error in send email!' });
        }
    });

    const PORT = 8080;
    const httpServer = app.listen(PORT, () => {
        console.log(`Start server in PORT ${PORT}`);
    });

    const io = new Server(httpServer);
    websocket(io);
};

initializeApp();

