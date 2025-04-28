import {Router} from 'express';
import { isAuthenticated } from './../../middleware/authenticationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as orderSchema from './orderSchema.js';
import * as orderController from './orderController.js';
const router=Router();

//create order
router.post('/',isAuthenticated,validation(orderSchema.createOrder),orderController.createOrder)

//cancel order
router.patch('/:id',isAuthenticated,validation(orderSchema.cancelOrder),orderController.cancelOrder)

export default router;
