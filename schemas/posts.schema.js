import Joi from "joi";

export const createPostSchema = Joi.object({
    title: Joi.string().min(3).required(),
    text: Joi.string().min(10).required()
});

export const updatePostSchema = Joi.object({
    title: Joi.string().min(3),
    text: Joi.string().min(10)
});

export const postIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});
