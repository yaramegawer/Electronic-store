import {model, Schema, Types} from 'mongoose';

const subCategorySchema=new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            min:5,
            max:20
        },
        slug:{
            type:String,
            required:true,
            unique:true,
        },
        createdBy:{
            type:Types.ObjectId,
            ref:"User",
            required:true
        },
        image:{
            id:{type:String},url:{type:String}
        },
        brand:[{type:Types.ObjectId,ref:"Brand"}],
        category:{type:Types.ObjectId,ref:"Category",required:true}
    },{timestamps:true}
);

export const subCategory=model("subCategory",subCategorySchema);