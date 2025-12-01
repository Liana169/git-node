import * as Posts from "../models/posts.js";


export async function getAllPosts(req, res, next) {
    try {
        const filters = {};
        if (req.query.id) filters.id = req.query.id;
        const posts = await Posts.getAllPosts(filters);
        res.json({ status: "ok", posts });
    } catch (err) {
        next(err);
    }
}


export async function getPost(req, res, next) {
    try {
        const post = await Posts.getPostById(req.params.id);
        if (!post) return res.status(404).json({ status: "error", message: "Post not found" });
        res.json({ status: "ok", post });
    } catch (err) {
        next(err);
    }
}
