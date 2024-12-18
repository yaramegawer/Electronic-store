import {Router} from 'express';
import { isAuthenticated } from './../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as orderSchema from './orderSchema.js';
import * as orderController from './orderController.js';
const router=Router();

//create order
router.post('/',isAuthenticated,isAuthorized("user"),validation(orderSchema.createOrder),orderController.createOrder)

//cancel order
router.patch('/:id',isAuthenticated,isAuthorized('user'),validation(orderSchema.cancelOrder),orderController.cancelOrder)

export default router;
