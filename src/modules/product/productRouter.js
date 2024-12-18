import {Router} from 'express';
import { isAuthenticated } from './../../middleware/authenticationMiddleware.js';
import { isAuthorized } from './../../middleware/authorizationMiddleware.js';
import { fileUpload } from './../../utils/fileUpload.js';
import {validation} from '../../middleware/validationMiddleware.js'
import * as productSchema from './productSchema.js';
import * as productController from './productController.js';
import reviewRouter from '../review/reviewRouter.js';
const router=Router();

router.use("/:productId/review",reviewRouter)
//create product
router.post('/',isAuthenticated,isAuthorized("seller"),fileUpload().fields([
    {name:"defaultImage",maxCount:1},
    {name:"subImage",maxCount:3},
]),validation(productSchema.createProduct),productController.createProduct);

//delete product
router.delete('/:id',isAuthenticated,isAuthorized("seller"),validation(productSchema.deleteProduct),productController.deleteProduct);

//get products
router.get('/',productController.allProducts);
export default router;