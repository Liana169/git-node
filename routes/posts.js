
import { Router } from "express";

import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from "../controllers/posts.js";

import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validation.js";

import {
    createPostSchema,
    updatePostSchema,
    postIdSchema
} from "../schemas/posts.schema.js";

const router = Router();


router.get('/', getAllPosts);


router.get('/:id', validate({ params: postIdSchema }), getPost);


router.post(
    '/',
    authorize,
    validate({ body: createPostSchema }),
    createPost
);


router.put(
    '/:id',
    authorize,
    validate({
        params: postIdSchema,
        body: updatePostSchema
    }),
    updatePost
);


router.delete(
    '/:id',
    authorize,
    validate({ params: postIdSchema }),
    deletePost
);

export default router;
