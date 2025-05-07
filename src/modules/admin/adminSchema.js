import joi from 'joi';

export const register=joi.object({
    name:joi.string().min(3).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required()
}).required();

export const activateAccount=joi.object({
    token:joi.string().required(),
}).required();

export const login=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required(),
}).required();

export const forgetCode=joi.object({
    email:joi.string().email().required(),
}).required();

export const resetPassword=joi.object({
    email:joi.string().email().required(),
    forgetCode:joi.string().length(5).required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required()

}).required();