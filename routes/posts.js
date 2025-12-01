import { Router } from "express";
import controller from "../controllers/posts.js";
import authorize from "../middlewares/authorize.js";

const router = Router();


router.get("/", controller.getAllPosts);
router.get("/:id", controller.getPost);

router.post("/", authorize, controller.createPost);
router.delete("/:id", authorize, controller.deletePost);

export default router;
