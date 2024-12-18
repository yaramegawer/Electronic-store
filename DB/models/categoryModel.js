import {model, Schema, Types} from 'mongoose';
import { subCategory } from './subCategoryModel.js';

const categorySchema=new Schema(
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
        brand:[{type:Types.ObjectId,ref:"Brand"}]
    },{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}/*so you can see the virtual field as json and object*/}
);
//delete one()>>document(category).deleteOne()
categorySchema.post('deleteOne',{document:true,query:false},async function(){
    //this>>>document thats why we use regular function
    //delete subcategories
    await subCategory.deleteMany({
        category:this._id
    })
})
//virtual subcategory field
categorySchema.virtual("subcategory",{
    ref:"subCategory",
    localField:"_id",//Category
    foreignField:"category"//subcategory
});


export const Category=model("Category",categorySchema);