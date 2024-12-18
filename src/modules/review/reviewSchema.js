import joi from 'joi';
import { isValidObjectId } from '../../middleware/validationMiddleware.js';

export const addReview=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5)
}).required();

export const updateReview=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
    productId:joi.string().custom(isValidObjectId).required(),
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5)

}).required();