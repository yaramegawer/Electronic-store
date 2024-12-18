import { model, Schema, Types } from "mongoose";

const productSchema=new Schema({
    name:{type:String,required:true,min:2,max:20},
    description:{type:String,min:10,max:200},
    images:[{
        id:{type:String,required:true},
        url:{type:String,required:true},
    }],
    defaultImage:{
        id:{type:String,required:true},
        url:{type:String,required:true},
    },
    availableItems:{type:Number,min:1,required:true},
    soldItems:{type:Number,default:0},
    price:{type:Number,min:1,required:true},
    discount:{type:Number,min:1,max:100},
    createdBy:{type:Types.ObjectId,ref:"User",required:true},
    category:{type:Types.ObjectId,ref:"Category",required:true},
    subcategory:{type:Types.ObjectId,ref:"subCategory",required:true},
    brand:{type:Types.ObjectId,ref:"Brand",required:true},
    cloudFolder:{type:String,unique:true,required:true},
    averageRate:{type:Number,min:1,max:5},
},{timestamps:true,strictQuery:true,toJSON:true,toObject:true});


productSchema.virtual("review",{
    ref:"Review",
    localField:"_id",
    foreignField:"productId",
});

//virtual

productSchema.virtual("finalPrice").get(function(){
    //this>>document ....return >>final price
    // if(this.discount>0){
    //     return this.price-(this.price*this.discount)/100;
    // }

    // return this.price;

    return Number.parseFloat(this.price-(this.price*this.discount||0)/100).toFixed(2);
});

///query helper so that you can make your own query method
productSchema.query.paginate=function(page){
    //this>>query
    //paginate>>> skip , limit
    page=page<1 || isNaN(page) || !page ? 1:page;
    const limit=2; // 1 product per page
    const skip= limit * ( page-1 ) ;
    return this.skip(skip).limit(limit);
};

productSchema.query.search=function (keyword){
    //this>>query
    if(keyword){
        return this.find({name:{$regex:keyword,$options:"i"}});
    }
};

//methods
productSchema.methods.inStock=function(requiredQuantity){
    return this.availableItems>=requiredQuantity?true:false
};

export const Product=model("Product",productSchema);