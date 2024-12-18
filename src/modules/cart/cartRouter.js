import {Router} from 'express';
import { isAuthenticated } from '../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as cartController from './cartController.js';
import * as cartSchema from './cartSchema.js';
const router=Router();

//add to cart
router.post('/',isAuthenticated,isAuthorized("user"),validation(cartSchema.addToCart),cartController.addToCart);
//get user cart
router.get('/',isAuthenticated,isAuthorized("user","admin"),validation(cartSchema.userCart),cartController.userCart);

//update cart
router.patch('/',isAuthenticated,isAuthorized("user"),validation(cartSchema.updateCart),cartController.updateCart);

//remove product from cart
router.patch('/:productId',isAuthenticated,isAuthorized("user"),validation(cartSchema.removeFromCart),cartController.removeFromCart)
//clear cart
//we used put instead of patch because if we used patch the above api will be called because it is before the clear api and it will
//mistake the clear word for the product id thats why we should use morgan so that we can know which endpoint is being called
router.put('/',isAuthenticated,isAuthorized("user"),cartController.clearCart);
export default router;