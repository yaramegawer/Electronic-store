import { model, Schema, Types } from "mongoose";

const orderSchema=new Schema({
    user:{type:Types.ObjectId,ref:"User",required:true},
    products:[{
        productId:{type:Types.ObjectId,ref:"Product"},
        quantity:{type:Number,min:1},
        name:String,
        itemPrice:Number,
        totalPrice:Number
    }],
    address:{type:String,required:true},
    payment:{type:String,default:"cash",enum:["cash","visa"]},
    phone:{type:String,required:true},
    price:{type:Number,required:true},
    status:{type:String,default:"placed",enum:["placed","shipped","delivered","canceled","refunded"]},
},{timestamps:true,toJSON:true,toObject:true});

export const Order=model("Order",orderSchema);