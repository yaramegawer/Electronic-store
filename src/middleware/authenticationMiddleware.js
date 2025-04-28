import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Token } from "../../DB/models/token.js";
import { User } from "../../DB/models/user.js";
dotenv.config();
export const isAuthenticated=asyncHandler(async(req,res,next)=>{
    //check token existence
    let token =req.headers["token"];
//extract payload
    const payload=jwt.verify(token,process.env.SECRET_KEY)
    ///check token in DB
    const tokenDB=await Token.findOne({token,isValid:true});
    if(!tokenDB) return next(new Error("Token invalid!"))
    //check user existence
    const user= await User.findById(payload.id);
    if(!user) return next(new Error("User not found!",{cause:404}));
    //pass user
    req.user=user;
    //next()
    return next();
});