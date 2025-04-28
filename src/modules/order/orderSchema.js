import joi from 'joi';
import { isValidObjectId } from './../../middleware/validationMiddleware.js';

export const createOrder=joi.object({
    phone:joi.string().required(),
    address:joi.string().required(),
    payment:joi.string().valid("cash","visa"),
}).required();

export const cancelOrder=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
}).required();
