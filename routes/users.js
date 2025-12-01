import { Router } from "express";
import controller from "../controllers/users.js";

const router = Router();


router.post("/register", controller.register);

router.post("/login", controller.login);

export default router;
