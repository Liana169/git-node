import * as Posts from '../models/posts.js';


export async function getAllPosts(req, res, next) {
    try {
        const { id } = req.query;
        const posts = await Posts.getAllPosts(id ? { id } : {});
        res.json({ status: 'ok', posts });
    } catch (err) {
        next(err);
    }
}


export async function getPost(req, res, next) {
    try {
        const post = await Posts.getPostById(req.params.id);
        if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });
        res.json({ status: 'ok', post });
    } catch (err) {
        next(err);
    }
}


export async function createPost(req, res, next) {
    try {
        const userId = req.user.id; // authorize middleware
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ status: 'error', message: 'Title and content required' });
        const post = await Posts.createPost({ title, content, userId });
        res.status(201).json({ status: 'ok', post });
    } catch (err) {
        next(err);
    }
}


export async function updatePost(req, res, next) {
    try {
        const userId = req.user.id;
        const post = await Posts.getPostById(req.params.id);
        if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });
        if (post.userId !== userId) return res.status(403).json({ status: 'error', message: 'Forbidden' });

        const updates = {};
        if (req.body.title) updates.title = req.body.title;
        if (req.body.content) updates.content = req.body.content;

        const updatedPost = await Posts.updatePost(req.params.id, updates);
        res.json({ status: 'ok', post: updatedPost });
    } catch (err) {
        next(err);
    }
}


export async function deletePost(req, res, next) {
    try {
        const userId = req.user.id;
        const post = await Posts.getPostById(req.params.id);
        if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });
        if (post.userId !== userId) return res.status(403).json({ status: 'error', message: 'Forbidden' });

        await Posts.deletePost(req.params.id);
        res.json({ status: 'ok', message: 'Post deleted successfully' });
    } catch (err) {
        next(err);
    }
}
