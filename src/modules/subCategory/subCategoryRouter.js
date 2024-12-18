import {Router} from 'express';
import { isAuthenticated } from '../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import { validation } from '../../middleware/validationMiddleware.js';
import * as subCategoryController from './subCategoryController.js'
import * as subCategorySchema from './subCategorySchema.js';
import { fileUpload } from '../../utils/fileUpload.js';


const router =Router({mergeParams:true});

//CRUD
//create subCategory
router.post('/',isAuthenticated,isAuthorized("admin"),fileUpload().single("subCategory"),validation(subCategorySchema.createSubCategory),subCategoryController.createSubCategory);

//update subCategory
router.patch('/:id',isAuthenticated,isAuthorized("admin"),fileUpload().single("subCategory"),validation(subCategorySchema.updateSubCategory),subCategoryController.updateSubCategory);

//delete subcategory
router.delete('/:id',isAuthenticated,isAuthorized("admin"),validation(subCategorySchema.deleteSubCategory),subCategoryController.deleteSubCategory);

//get all subcategories
router.get('/',validation(subCategorySchema.getSubCategories),subCategoryController.allSubCategories);


export default router;