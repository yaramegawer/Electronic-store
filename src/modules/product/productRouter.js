import {Router} from 'express';
import { isAuthenticated } from './../../middleware/authenticationMiddleware.js';
import { fileUpload } from './../../utils/fileUpload.js';
import {validation} from '../../middleware/validationMiddleware.js'
import * as productSchema from './productSchema.js';
import * as productController from './productController.js';
const router=Router();

//create product
router.post('/',isAuthenticated,fileUpload().fields([
    {name:"productImage",maxCount:1},
]),validation(productSchema.createProduct),productController.createProduct);

//delete product
router.delete('/:id',isAuthenticated,validation(productSchema.deleteProduct),productController.deleteProduct);

//get products
router.get('/',productController.allProducts);
export default router;