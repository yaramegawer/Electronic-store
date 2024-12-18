import {Router} from 'express';
import { isAuthenticated } from './../../middleware/authenticationMiddleware.js';
import { isAuthorized } from './../../middleware/authorizationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as couponSchema from './couponSchema.js';
import* as couponController from './couponController.js';
const router=Router();

//create coupon
router.post('/',isAuthenticated,isAuthorized("seller"),validation(couponSchema.createCoupon),couponController.createCoupon)
//update coupon
router.patch('/:code',isAuthenticated,isAuthorized("seller"),validation(couponSchema.updateCoupon),couponController.updateCoupon)
//delete coupon
router.delete('/:code',isAuthenticated,isAuthorized("seller"),validation(couponSchema.deleteCoupon),couponController.deleteCoupon)
//get all coupon
router.get('/',isAuthenticated,isAuthorized("admin","seller"),couponController.allCoupons);


export default router;