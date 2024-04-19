import { Router } from "express"
import messageManagerDB from "../dao/messageManagerDB.js"

const router = Router()
const messageService = new messageManagerDB() // Instanciar la clase

router.get("/chat", async (req, res) => {
    try {
        const messages = await messageService.getAllMessages()
        res.render("chat", {
            title: "Chat", // Corregí el nombre de la propiedad "title"
            style: "index.css",
            messages: messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error")
    }
});

export default router