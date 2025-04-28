import { model, Schema, Types } from "mongoose";

const productSchema=new Schema({
    name:{type:String,required:true,min:2,max:20},
    description:{type:String,min:10,max:200},
    productImage:{
        id:{type:String,required:true},
        url:{type:String,required:true},
    },
    availableItems:{type:Number,min:1,required:true},
    soldItems:{type:Number,default:0},
    price:{type:Number,min:1,required:true},
    createdBy:{type:Types.ObjectId,ref:"User",required:true},
    cloudFolder:{type:String,unique:true,required:true},
},{timestamps:true,strictQuery:true,toJSON:true,toObject:true});

productSchema.methods.inStock=function(requiredQuantity){
    return this.availableItems>=requiredQuantity?true:false
};

export const Product=model("Product",productSchema);