import joi from 'joi';
import { isValidObjectId } from '../../middleware/validationMiddleware.js';

export const addToCart=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1).required(),
}).required();

export const userCart=joi.object({
    cartId:joi.string().custom(isValidObjectId),
}).required();


export const removeFromCart=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
}).required();