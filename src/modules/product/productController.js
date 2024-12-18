import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from './../../../DB/models/categoryModel.js';
import { subCategory } from './../../../DB/models/subCategoryModel.js';
import { Brand } from './../../../DB/models/brandModel.js';
import {nanoid}  from "nanoid";
import cloudinary from './../../utils/cloudinary.js';
import { Product } from './../../../DB/models/productModel.js';

export const createProduct=asyncHandler(async(req,res,next)=>{
    //check category
    const category=await Category.findById(req.body.category);
    if(!category) return next(new Error("Category not found!",{cause:404}))
    //check subcategory
    const subcategory=await subCategory.findById(req.body.subcategory);
    if(!subcategory) return next(new Error("SubCategory not found!",{cause:404}))
    
    //check brand
    const brand=await Brand.findById(req.body.brand);
    if(!brand) return next(new Error("Brand not found!",{cause:404}))
    
    //check files
    if(!req.files) return next(new Error("product images are required",{cause:400}));

    //create folder name
    const cloudFolder=nanoid();

    let images=[]
    //upload sub images
    for(const file of req.files.subImage){
        const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`});
        images.push({id:public_id,url:secure_url});
    }

    //upload default image
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.defaultImage[0].path,{folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`});

    //create product
    const product=await Product.create({...req.body,cloudFolder,createdBy:req.user._id,defaultImage:{url:secure_url,id:public_id},images});

    //send response
    return res.json({
        success:true,
        message:"product created successfully"
    })
});

export const deleteProduct=asyncHandler(async(req,res,next)=>{
    //check product
    const product=await Product.findById(req.params.id);
    if(!product) return next(new Error("Product not found",{cause:404}));
    
    //check owner
    if(req.user.id!=product.createdBy.toString())
        return next(new Error("Not authorized",{cause:401}));

    //delete product from db
    await product.deleteOne();
    //delete images
    const ids=product.images.map((image)=>image.id);
    ids.push(product.defaultImage.id);
    await cloudinary.api.delete_resources(ids);
    //delete folder
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`)
    //return response
    return res.json({
        success:true,
        message:"product deleted successfully!"
    })

});

export const allProducts=asyncHandler(async(req,res,next)=>{
    //req.query
    const {page,sort,keyword,category,brand,subcategory}=req.query;
    //search,filter,sort,pagination

    //search
    //const result = await Product.find({name:{$regex:keyword,$options:"i"}});
    
    //filter
    //const result=await Product.find({...req.query})

    //sort
    //const result=await Product.find({}).sort(sort);

    //paginate>>> skip , limit
    // page=page<1 || isNaN(page) || !page ? 1:page;
    // const limit=2; // 1 product per page
    // const skip= limit * ( page-1 ) ;
    // const result=await Product.find({}).skip(skip).limit(limit);

    //search,filter,sort,pagination
    if(category && !(await Category.findById(category)))
        return next(new Error("Category not found!",{cause:404}))
    if(subcategory && !(await subCategory.findById(subcategory)))
        return next(new Error("subCategory not found!",{cause:404}))
    if(brand && !(await Brand.findById(brand)))
        return next(new Error("brand not found!",{cause:404}))

    const result=await Product.find({...req.query}).sort(sort).paginate(page).search(keyword); //problem

    return res.json({success:true,result}); 
});