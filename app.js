import express from "express";
import morgan from "morgan";
import * as usersModel from "./models/users.js";
import * as postsModel from "./models/posts.js";


import * as usersController from "./controllers/users.js";
import * as postsController from "./controllers/posts.js";


import authorize from "./middlewares/authorize.js";

const app = express();
const PORT = 3000;

process.env.AUTH_SECRET = "MY_SUPER_SECRET_KEY";

await usersModel.initializeDataFile();
await postsModel.initializePostsFile();

app.use(morgan("dev"));
app.use(express.json());

app.post("/users/register", usersController.register);
app.post("/users/login", usersController.login);


app.get("/users/me", authorize, async (req, res, next) => {
    try {
        const user = await usersModel.findUserByID(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });
        res.json({ status: "ok", user });
    } catch (err) {
        next(err);
    }
});


app.get("/posts", postsController.getAllPosts);
app.get("/posts/:id", postsController.getPost);


app.post("/posts", authorize, async (req, res, next) => {
    try {
        const post = await postsModel.createPost({
            ...req.body,
            userId: req.userId,
        });
        res.json({ status: "ok", post });
    } catch (err) {
        next(err);
    }
});

app.put("/posts/:id", authorize, async (req, res, next) => {
    try {
        const existing = await postsModel.getPostById(req.params.id);
        if (!existing) return res.status(404).json({ status: "error", message: "Post not found" });
        if (existing.userId !== req.userId)
            return res.status(403).json({ status: "error", message: "Forbidden" });

        const updated = await postsModel.updatePost(req.params.id, req.body);
        res.json({ status: "ok", post: updated });
    } catch (err) {
        next(err);
    }
});

app.delete("/posts/:id", authorize, async (req, res, next) => {
    try {
        const existing = await postsModel.getPostById(req.params.id);
        if (!existing) return res.status(404).json({ status: "error", message: "Post not found" });
        if (existing.userId !== req.userId)
            return res.status(403).json({ status: "error", message: "Forbidden" });

        const deleted = await postsModel.deletePost(req.params.id);
        res.json({ status: "ok", post: deleted });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        status: "error",
        message: err.message || "Internal server error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
