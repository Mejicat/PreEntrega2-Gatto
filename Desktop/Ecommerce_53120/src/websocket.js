import { ProductManagerDB } from "./dao/productManagerDB.js"
import MessageManagerDB  from "./dao/messageManagerDB.js"

const ProductService = new ProductManagerDB()
const MessageService = new MessageManagerDB()

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {

            try {
                await ProductService.createProduct(data);
                const products = await ProductService.getAllProducts();
                socket.emit("publishProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductService.deleteProduct(data.pid);
                socket.emit("publishProducts", result);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("createMessage", async (data) => {
            try {
                await MessageService.createMessage(data.user, data.message)
                const messages = await MessageService.getAllMessages()
                io.emit("publishMessages", messages)
            } catch (error) {
                socket.emit("statusError", error.message)
            }
        })

        // Mensaje de usuario escribiendo
        socket.on('typing', (data) => {
            socket.broadcast.emit("typing", data)
        })
    });
};
