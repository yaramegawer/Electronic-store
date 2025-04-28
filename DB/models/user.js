import { Schema,model } from "mongoose";
import  bcryptjs from 'bcryptjs';

const userSchema=new Schema({
    userName:{
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

    phone:{
        type:String
    },
    role:{
        type:String,
        enim:["user",,"admin"],
        default:"user"
    },
    forgetCode:String,
   },{timestamps:true});

export const User=model("User",userSchema);
