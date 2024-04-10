//import { productManagerFS } from "./dao/productManagerFS.js";
//const ProductService = new productManagerFS('products.json');
import { productManagerDB } from "./dao/productManagerDB.js"
import { messageManagerDB } from "./dao/messageManagerDB.js"

const ProductService = new productManagerDB()
const MessageService = new messageManagerDB()

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

        // Orientación del profe en la clase:
        /*socket.on("message", async (data) => {
            try {
                const result = await messageService.insertMessage({ user, message });
                socket.emit("messagesLogs", messageService.getAll());
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("userConnect", async (data) => {
            io.emit("messagesLogs", messages);
            socket.broadcast.emit("newUser", data);
        });*/

        socket.on("createMessage", async (data) => {
            try {
                await MessageService.createMessage(data.user, data.message);
                const messages = await MessageService.getAllMessages();
                io.emit("publishMessages", messages);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        })

        // Mensaje de usuario escribiendo
        socket.on('typing', (data) => {
            socket.broadcast.emit("typing", data)
        })
    });
};
