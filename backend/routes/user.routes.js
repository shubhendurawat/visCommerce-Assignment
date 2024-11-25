import express from "express"; 
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { getUserBySearch } from "../controllers/User-Search.controller.js";
import { getCurrentChatters } from "../controllers/User-Search.controller.js";

const router = express.Router();

router.get('/search', isLoggedIn, getUserBySearch); 
router.get('/currentchatters', isLoggedIn, getCurrentChatters);

export default router; 