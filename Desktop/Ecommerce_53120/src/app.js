import express from 'express';
import handlebars from 'express-handlebars';
import apiProductRouter from './routes/apiProductRouter.js';
import apiCartRouter from './routes/apiCartRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtil.js';
import {Server} from 'socket.io';
import websocket from './websocket.js';
import mongoose from 'mongoose';

const app = express();

//MongoDB connect
const uri = "mongodb+srv://lucasgatto:tDM2EhNHbMihAdV4@cluster0.1npyj6s.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Routers
app.use('/api/products', apiProductRouter);
app.use('/api/carts', apiCartRouter);
app.use('/products', productsRouter);
app.use("/carts", cartsRouter)
app.use('/chat', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);