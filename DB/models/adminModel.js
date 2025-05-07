import { Schema,model } from "mongoose";

const adminSchema=new Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:30
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    forgetCode:String,
   },{timestamps:true});

export const Admin=model("Admin",adminSchema);
