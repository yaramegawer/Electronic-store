
import joi from 'joi';
import { isValidObjectId } from '../../middleware/validationMiddleware.js';
export const createProduct=joi.object({
    name:joi.string().min(2).max(20).required(),
    description:joi.string().min(10).max(200),
    availableItems:joi.number().integer().min(1).required(),
    price:joi.number().integer().min(1).required(),

}).required();

export const deleteProduct=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
}).required();