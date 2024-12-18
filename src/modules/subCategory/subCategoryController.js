import slugify from "slugify";
import { Category } from "../../../DB/models/categoryModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {  subCategory } from './../../../DB/models/subCategoryModel.js';
import cloudinary from "../../utils/cloudinary.js";

export const createSubCategory=asyncHandler(async(req,res,next)=>{
    //check category
    const category=await Category.findById(req.params.category);
    if(!category) return next(new Error("Category not found!"))
    
    //data>> name slug createdBy image
    //check file
    if(!req.file) return next(new Error("Category image is required",{cause:400}));

    //upload image in cloudinary
    const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.CLOUD_FOLDER_NAME}/subCategory`
    });

    //save category in DB
    await subCategory.create({
        name:req.body.name,
        slug:slugify(req.body.name),
        createdBy:req.user._id,
        image:{id:public_id,url:secure_url},
        category:req.params.category,
    });

    //return response
    return res.json({
        success:true,
        message:"subCategory created successfully"
    })

});


export const updateSubCategory=asyncHandler(async(req,res,next)=>{

    //check category in DB
    const category=await Category.findById(req.params.category);
    if(!category) return next(new Error("Category not found!",{cause:404}));
    
    //check sub Category in DB and check if category is the right parent
    const subcategory=await subCategory.findOne({_id:req.params.id,category:req.params.category});
    if(!subcategory) return next(new Error("subCategory not found!",{cause:404}));
    //check category owner
    if(req.user._id.toString()!==subcategory.createdBy.toString())
        return next(new Error("Not allowed to update category!"));
    //check file >>upload in cloudinary
    if(req.file){
        const {public_id,secure_url}=await cloudinary.uploader.upload(
            req.file.path,
            {public_id:category.image.id}
        );
        subcategory.image={id:public_id,url:secure_url};
    }
    //update category
    subcategory.name=req.body.name?req.body.name:subcategory.name;
    subcategory.slug=req.body.name?slugify(req.body.name):subCategory.slug;
    //save category
    await subcategory.save();
    //return response
    return res.json({
        success:true,
        message:"subCategory updated successfully!"
    });
});

export const deleteSubCategory=asyncHandler(async(req,res,next)=>{
    //check category in DB
    const category=await Category.findById(req.params.category);
    if(!category) return next(new Error("Category not found!",{cause:404}));
    
    //check sub Category in DB and check if category is the right parent
    const subcategory=await subCategory.findOne({_id:req.params.id,category:req.params.category});
    if(!subcategory) return next(new Error("subCategory not found!",{cause:404}));

    //check subcategory owner
    if(req.user._id.toString()!==subcategory.createdBy.toString())
        return next(new Error("Not allowed to delete category!"));
    
    await subCategory.findOneAndDelete(req.params.id);
    await cloudinary.uploader.destroy(subcategory.image.id);
    //return response
    return res.json({
        success:true,
        message:"SubCategory deleted successfully!"
    });
});

export const allSubCategories=asyncHandler(async(req,res,next)=>{
    let results;
    if(req.params.category!==undefined){
            //check categories in DB
        const category =await Category.findById(req.params.category);
        if(!category) return next(new Error("Category not found!",{cause:404}));
    
        //all subcategories of certain category
        const results=await subCategory.find({category:req.params.category})
        res.json({
            success:true,
            results
        })}

    //nested populate
    //results=await subCategory.find().populate([{path,"category",populate:[{path:"CreatedBy",select:"email"}]}]);    
    //multiple populate
    //results =await subCategory.find().populate([{path:"category",select:"name -_id"},{path:"createdBy",select:"userName -_id"}]);
    //multiple populate with nested populate
    results =await subCategory.find().populate([{path:"category",select:"name -_id",populate:{path:"createdBy"}},{path:"createdBy",select:"userName -_id"}]);

    return res.json({success:true,results});
    
})

