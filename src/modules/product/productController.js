import { asyncHandler } from "../../utils/asyncHandler.js";
import {nanoid}  from "nanoid";
import cloudinary from './../../utils/cloudinary.js';
import { Product } from './../../../DB/models/productModel.js';

export const createProduct=asyncHandler(async(req,res,next)=>{

    //check files
    if(!req.files) return next(new Error("product images are required",{cause:400}));

    //create folder name
    const cloudFolder=nanoid();


    //upload default image
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.productImage[0].path,{folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`});

    //create product
    const product=await Product.create({...req.body,cloudFolder,createdBy:req.admin._id,productImage:{url:secure_url,id:public_id}});

    //send response
    return res.json({
        success:true,
        message:"product created successfully"
    })
});

export const deleteProduct=asyncHandler(async(req,res,next)=>{
    //check product
    const {id}=req.params;
    const product=await Product.findById(id);
    if(!product) return next(new Error("Product not found",{cause:404}));
    

  
    const img_id=product.productImage.id;
    await cloudinary.api.delete_resources(img_id);
    //delete folder
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`)
    
    //delete product from db
    await product.deleteOne();

    //return response
    return res.json({
        success:true,
        message:"product deleted successfully!"
    })

});

export const allProducts=asyncHandler(async(req,res,next)=>{
    const { sort = "", keyword = "" } = req.query;

  // Build search query
  let products;

  if (keyword) {
    // Search only
    const searchQuery = { name: { $regex: keyword, $options: "i" } };
    products = await Product.find(searchQuery);
  } else if (sort) {
    // Sort only
    products = await Product.find({}).sort(sort);
  } else {
    // No search, no sort — return all
    products = await Product.find({});
  }

  return res.json({
    success: true,
    count: products.length,
    products,
  });
});