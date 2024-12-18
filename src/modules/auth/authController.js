
import { asyncHandler } from './../../utils/asyncHandler.js';
import { User } from './../../../DB/models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from './../../utils/sendEmails.js';
import { Token } from './../../../DB/models/token.js';
import randomstring from 'randomstring';
import { Cart } from '../../../DB/models/cartModel.js';

const register=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email,userName,password}=req.body;
    //check user existence
    const user=await User.findOne({email});
    if(user) return next(new Error("User already exists",{cause:409}));
    // //hash password
    // const hashPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND));
    //generate token
    const token=jwt.sign({email},process.env.SECRET_KEY)
    //create user
    await User.create({...req.body/*,password:hashPassword*/});
    //create confirmationLink
    const confirmationLink=`http://localhost:3000/auth/activate_account/${token}`;


    //send email
    const messageSent=await sendEmail({to:email,subject:"Activate account",html:`<a href=${confirmationLink}>Activate account</a>`});
    if(!messageSent) return next(new Error("Something went wrong!"))
    //send response
    return res.status(201).json({
        success:true,
        message:"Check your email"
    })
});

const activateAccount=asyncHandler(async(req,res,next)=>{
    //get token
    const {token}=req.params;
    const {email}=jwt.verify(token,process.env.SECRET_KEY);
    
    //find user,update isConfirmed
    const user=await User.findOneAndUpdate({email},{isConfirmed:true});
    //check if the user doesn't exist
    if(!user) return next(new Error("User not found!",{cause:404}));
    //create a cart 
    await Cart.create({user:user._id});

    //send response
    return res.status(200).json({
        success:true,
        message:"Try to login!"
    })
});

const login=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email,password} =req.body;
    //check user existence
    const user=await User.findOne({email});
    if(!user) return next(new Error("Invalid email!",{cause:404}));
    //check is confirmed
    if(!user.isConfirmed) return next(new Error("You must activate your account first!"));
    //check password
    const match=bcrypt.compareSync(password,user.password);
    if(!match) return next(new Error("Invalid Password!"))
    //generate token
    const token=jwt.sign({email,id:user._id},process.env.SECRET_KEY);
    //save token in token model
    await Token.create({token,user:user._id});
    //send response
    return res.json({
        success:true,
        message:"User logged in successfully"
    })
});
//forgetCode
const forgetCode=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email}=req.body;
    //check user existence
    const user=await User.findOne({email});
    if(!user) return next(new Error("User not found!",{cause:404}));
    //check is confirmed
    if(!user.isConfirmed) return next(new Error("You must activate your account first!"));
    //generate forgetCode
    const forgetCode=randomstring.generate({
        charset:"numeric",
        length:5
    });
    //save forgetCode to user
    user.forgetCode=forgetCode;
    await user.save();
    //send email
    const messageSent=await sendEmail({
        to:email,
        subject:"Reset Password",
        html:`forget password code ${forgetCode}`
    });
    if(!messageSent) return next(new Error("Something went wrong!"));
    //send response //redirect frontend
    res.json({
        success:true,
        message:"Check your email"
    });
});

//resetPassword
const resetPassword=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email,password,forgetCode}=req.body;
    //check user existence
    const user=await User.findOne({email});
    if(!user) return next(new Error("User not found!",{cause:404}));
    //check forgetCode
    if(forgetCode!==user.forgetCode) return next(new Error("Code is invalid!"));
    // //hash password and save user
    // user.password=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND));
    await user.save(); 
    //find all token of the user
    const tokens=await Token.find({user:user._id});
    //invalidate all tokens
    tokens.forEach(async(token)=>{
        token.isValid=false;
        await token.save();
    })
    //send response
    return res.json({
        success:true,
        message:"Try to login now"
    });
});
export {register,activateAccount,login,forgetCode,resetPassword};