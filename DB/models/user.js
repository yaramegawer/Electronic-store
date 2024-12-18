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
    isConfirmed:{
        type:Boolean,
        default:false
    },
    gender:{
        type:String,
        enum:["male","female"]
    },
    phone:{
        type:String
    },
    role:{
        type:String,
        enim:["user","seller","admin"],
        default:"user"
    },
    forgetCode:String,
    profileImage:{url:{type:String,default:"https://res.cloudinary.com/drgcr9g01/image/upload/v1732817279/download_dh3hmb.jpg"},id:{type:String,default:"download_dh3hmb"}},
    coverImages:[{url:{type:String},id:{type:String}}]
},{timestamps:true});

userSchema.pre("save",function(){

    if(this.isModified("password")){
    this.password=bcryptjs.hashSync(
        this.password,parseInt(process.env.SALT_ROUND));
    }
});

export const User=model("User",userSchema);
