import { Router } from "express";

import MessageService from "../services/messageService.js";
import auth from "../middlewares/auth.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router()

router.get("/", auth, isVerified, async (req, res) => {
  try {
    const messages = await MessageService.getMessages()
    res.render(
      "chat", 
      { 
        messages: messages
      })
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message })
  }
})

export default router;