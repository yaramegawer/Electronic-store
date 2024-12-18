import {Router} from 'express';
import * as brandController from './brandController.js';
import * as brandSchema from './brandSchema.js';
import { isAuthenticated } from '../../middleware/authenticationMiddleware.js';
import { isAuthorized } from '../../middleware/authorizationMiddleware.js';
import { fileUpload } from '../../utils/fileUpload.js';
import { validation } from '../../middleware/validationMiddleware.js';

const router=Router();


//CRUD

//crete brand
router.post('/',isAuthenticated,isAuthorized("admin"),fileUpload().single("brand"),validation(brandSchema.createBrand),brandController.createBrand);
//update brand
router.patch('/:id',isAuthenticated,isAuthorized("admin"),fileUpload().single("brand"),validation(brandSchema.updateBrand),brandController.updateBrand);
//delete brand
router.delete('/:id',isAuthenticated,isAuthorized("admin"),validation(brandSchema.deleteBrand),brandController.deleteBrand);
//get brands
router.get('/',brandController.getBrand);
export default router;