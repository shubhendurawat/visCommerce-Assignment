import express from "express";
import { userRegister } from "../controllers/User-Route.controller.js";
import { userLogin } from "../controllers/User-Route.controller.js";
import { userLogut } from "../controllers/User-Route.controller.js";


const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogut); 

export default router;