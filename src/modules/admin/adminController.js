import { asyncHandler } from './../../utils/asyncHandler.js';
import { Admin } from '../../../DB/models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from './../../utils/sendEmails.js';
import { Token } from './../../../DB/models/token.js';
import randomstring from 'randomstring';
import { User } from '../../../DB/models/user.js';
import { Order } from '../../../DB/models/orderModel.js';


const register=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email,userName,password}=req.body;
    //check user existence
    const user=await Admin.findOne({email});
    if(user) return next(new Error("User already exists",{cause:409}));
     //hash password
    const hashPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND));
   
    //create user
    await Admin.create({...req.body,password:hashPassword});
    //create confirmationLink
   
    return res.status(201).json({
        success:true,
        message:"User created successfully"
    })
});


const login=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email,password} =req.body;
    //check user existence
    const user=await Admin.findOne({email});
    if(!user) return next(new Error("Invalid email!",{cause:404}));

//generate token
    const token=jwt.sign({email,id:user._id},process.env.SECRET_KEY);
    //save token in token model
    await Token.create({token,user:user._id});
    //send response
    return res.json({
        success:true,
        message:"User logged in successfully",
        token:token
    })
});
//forgetCode
const forgetCode=asyncHandler(async(req,res,next)=>{
    //data from request
    const {email}=req.body;
    //check user existence
    const user=await Admin.findOne({email});
    if(!user) return next(new Error("User not found!",{cause:404}));
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
    const user=await Admin.findOne({email});
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

const deleteUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    //check user existence
    const user=await User.findByIdAndDelete(id);
    if(!user) return next(new Error("User not found!",{cause:404}));


    return res.json({
        success:true,
        message:"User deleted successfully!"
    });
});


const getAllUsers=asyncHandler(async(req,res,next)=>{
    const users=await User.find();

    return res.json({
        success:true,
        users:{users}
    });
});

const getAllOrders=asyncHandler(async(req,res,next)=>{
    const orders=await Order.find();

    return res.json({
        success:true,
        orders:{orders}
    });
});


const updateOrderStatus=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const { status } = req.body;

    // Optional: validate status value manually (can also be done via schema validation middleware)
    const validStatuses = ["placed", "shipped", "delivered", "canceled", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
  
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return the updated document
    );
  
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
  
    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  });


export {register,login,forgetCode,resetPassword,deleteUser,getAllUsers,getAllOrders,updateOrderStatus};