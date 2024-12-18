import {Router} from 'express';
import { isAuthenticated } from '../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as categoryController from './categoryController.js'
import * as categorySchema from './categorySchema.js';
import { fileUpload } from '../../utils/fileUpload.js';
import subCategoryRouter from './../subCategory/subCategoryRouter.js';


const router=Router();

//access subCategory
router.use('/:category/subCategory',subCategoryRouter)

//CRUD

//create category
router.post('/',isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.createCategory),categoryController.createCategory);

//update category
router.patch('/:id',isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.updateCategory),categoryController.updateCategory);

//delete category
router.delete('/:id',isAuthenticated,isAuthorized("admin"),validation(categorySchema.deleteCategory),categoryController.deleteCategory);

//get all categories
router.get('/',categoryController.allCategories);

export default router;