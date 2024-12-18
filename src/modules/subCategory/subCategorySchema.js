import joi from 'joi';
import { isValidObjectId } from '../../middleware/validationMiddleware.js';

export const createSubCategory=joi.object({
    name:joi.string().min(5).max(20).required(),
    category:joi.string().custom(isValidObjectId).required(),
}).required();

export const updateSubCategory=joi.object({
    name:joi.string().min(5).max(20),
    id:joi.string().custom(isValidObjectId).required(),//subCategory
    category:joi.string().custom(isValidObjectId).required(),
}).required();

export const deleteSubCategory=joi.object({
    id:joi.string().custom(isValidObjectId).required(),//subCategory
    category:joi.string().custom(isValidObjectId).required(),
}).required();

export const getSubCategories=joi.object({
    category:joi.string().custom(isValidObjectId),
}).required();