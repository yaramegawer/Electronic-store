import {Router} from 'express';
import { isAuthenticated } from '../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import * as reviewSchema from './reviewSchema.js';
import * as reviewController from './reviewController.js'
import { validation } from '../../middleware/validationMiddleware.js';
const router=Router({mergeParams:true});

//add review
router.post('/',isAuthenticated,isAuthorized("user"),validation(reviewSchema.addReview),reviewController.addReview);
//update review
router.patch('/:id',isAuthenticated,isAuthorized("user"),validation(reviewSchema.updateReview),reviewController.updateReview);

export default router;
