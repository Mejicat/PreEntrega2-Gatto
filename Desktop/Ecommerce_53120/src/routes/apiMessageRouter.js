import { Router } from "express";

import MessageService from "../services/messageService.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const messages = await MessageService.getMessages();
    res.status(200).send({ status: "success", messages });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { message } = req.body;
  const {email, firstName} = req.session.user;

  if (!email || !firstName) {
    return res.status(400).send({ status: "error", message: "falta el usuario" });
  }
 
  if (!message) {
    return res.status(400).send({ status: "error", message: "falta el mensaje" });
  }

  try {
    const newMessage = await MessageService.addMessage({ email, firstName, message });
    res.status(201).send({ status: "success", message: newMessage });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router