import { Brand } from "../../../DB/models/brandModel.js";
import { Category } from "../../../DB/models/categoryModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";
import  slugify  from 'slugify';

export const createBrand=asyncHandler(async(req,res,next)=>{
    //check categories
    const {categories,name}=req.body;

    categories.forEach(async(categoryId) => {
        const category=await Category.findById(categoryId);
        if(!category)
            return next(new Error( `category ${category} not found!`,{cause:404}));
    });

    if(!req.file) return next(new Error("Brand image is required!",{cause:404}));

    const {secure_url,public_id}=await cloudinary.uploader.upload(
        req.file.path,
        {folder:`${process.env.CLOUD_FOLDER_NAME}/brands`}
    );
    const brand=await Brand.create({
        name,
        createdBy:req.user._id,
        slug:slugify(name),
        image:{url:secure_url,id:public_id},
    });
    //save brand in each category
    //category {name:,_id:,slug:,brands:["",""]};
    categories.forEach(async(categoryId)=>{
        await Category.findByIdAndUpdate(categoryId,{
            $push:{brand:brand._id},
        });
        //category.brand.push(brand._id);
        //await category.save();
    });

    //return response
    return res.json({
        success:true,
        message:"brand created successfully!"
    });
});

export const updateBrand=asyncHandler(async(req,res,next)=>{
    const brand=await Brand.findById(req.params.id)
    if(!brand) return next(new Error("Brand not found",{cause:404}));
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(brand.image.id)
        brand.image={url:secure_url,id:public_id};

    };
    brand.name=req.body.name?req.body.name:brand.name;
    brand.slug=req.body.slug?slugify(req.body.name):brand.slug;
    await brand.save();
    res.json({
        success:true,
        message:"Brand updated successfully"
    })
});

export const deleteBrand=asyncHandler(async(req,res,next)=>{
    const brand=await Brand.findByIdAndDelete(req.params.id)
    if(!brand) return next(new Error("Brand not found",{cause:404}));
    

    //delete image
    await cloudinary.uploader.destroy(brand.image.id);
    //delete brand from categories
    //find categories which have brand in brands array
    await Category.updateMany({},{$pull:{brand:brand._id}});

    return res.json({success:true,message:"Brand deleted successfully!"})
});

export const getBrand=asyncHandler(async(req,res,next)=>{
    const results=await  Brand.find();
    return res.json({
        success:true,
        results
    });
});