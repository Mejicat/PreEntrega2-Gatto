//Este archivo de Factory NO está preparado aún para soportar distintos tipos de persistencia.

import connectToMongo from "./connection.js";
import ProductDAO from "../dao/productDAO.js";
import CartDAO from "../dao/cartDAO.js";
import UserDAO from "../dao/userDAO.js";
import TicketDAO from "../dao/ticketDAO.js";

const Products = async () => {
    const mongoConnection = await connectToMongo();

    if (mongoConnection.readyState !== 1) {
        throw new Error('MongoDB connection is not ready');
    }

    return {
        productDAO: new ProductDAO(),
        cartDAO: new CartDAO(),
        userDAO: new UserDAO(),
        ticketDAO: new TicketDAO()
    };
};

export default Products;

