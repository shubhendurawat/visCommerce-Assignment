import express from "express";
import { getMessages, sendMessage } from "../controllers/Message-Route.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post('/send/:id', isLoggedIn, sendMessage);
router.get('/:id', isLoggedIn, getMessages);

export default router;