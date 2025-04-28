import {Router} from 'express';
const router=Router();
import * as authController from './authController.js';
import * as authSchema from './authSchema.js';
import { validation } from './../../middleware/validationMiddleware.js';


//Register
router.post("/register",validation(authSchema.register),authController.register)
//Login
router.post('/login',validation(authSchema.login),authController.login);
//Send forget code
router.patch('/forgetCode',validation(authSchema.forgetCode),authController.forgetCode);
//reset password
router.patch('/resetPassword',validation(authSchema.resetPassword),authController.resetPassword);


export default router;