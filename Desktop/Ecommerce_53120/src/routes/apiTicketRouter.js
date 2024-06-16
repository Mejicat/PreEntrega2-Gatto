import { Router } from "express";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import ticketService from "../services/ticketService.js";
import CustomError from '../services/errors/customError.js';
import { ErrorCodes } from '../services/errors/enums.js';

const router = Router();

router.get('/', auth, isAdmin, async (req, res, next) => {
  try {
    const tickets = await ticketService.getTickets();
    res.status(200).send({ status: 'success', message: 'tickets encontrados', tickets });
  } catch (error) {
    next(error);
  }
});

export default router;
