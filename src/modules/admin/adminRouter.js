import { Router } from "express";
const router=Router();
import * as productController from '../product/productController.js';
import { cancelOrder } from "../order/orderController.js";
import * as productSchema from '../product/productSchema.js';
import * as adminController from './adminController.js';
import * as adminSchema from './adminSchema.js';
import { isAuthenticated } from "../../middleware/authenticationMiddleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validationMiddleware.js";


//create product
router.post('/product',isAuthenticated,fileUpload().fields([
    {name:"productImage",maxCount:1},
]),validation(productSchema.createProduct),productController.createProduct);

//delete product
router.delete('/product:id',isAuthenticated,validation(productSchema.deleteProduct),productController.deleteProduct);

//get products
router.get('/product',productController.allProducts);

//cancel order
router.patch('/:id',isAuthenticated,validation(cancelOrder),cancelOrder)

//Register
router.post("/register",validation(adminSchema.register),adminController.register)
//Login
router.post('/login',validation(adminSchema.login),adminController.login);
//Send forget code
router.patch('/forgetCode',validation(adminSchema.forgetCode),adminController.forgetCode);
//reset password
router.patch('/resetPassword',validation(adminSchema.resetPassword),adminController.resetPassword);

router.delete('/deleteUser/:id',isAuthenticated,adminController.deleteUser);

router.get('/getAllUsers',isAuthenticated,adminController.getAllUsers);

router.get('/getAllOrders',isAuthenticated,adminController.getAllOrders);

router.put('/updateOrderStatus/:id',isAuthenticated,adminController.updateOrderStatus);




export default router;