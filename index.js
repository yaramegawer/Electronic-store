import express from 'express';
const app = express();
import morgan from 'morgan';
import {connectDB} from './DB/connection.js';
import dotenv from 'dotenv';
import authRouter from './src/modules/auth/authRouter.js';
import categoryRouter from './src/modules/category/categoryRouter.js';
import subCategoryRouter from './src/modules/subCategory/subCategoryRouter.js';
import brandRouter from './src/modules/brand/brandRouter.js';
import couponRouter from './src/modules/coupon/couponRouter.js';
import productRouter from './src/modules/product/productRouter.js';
import cartRouter from './src/modules/cart/cartRouter.js';
import createInvoice from "./src/utils/pdfInvoice.js";
import orderRouter from './src/modules/order/orderRouter.js';
import reviewRouter from './src/modules/review/reviewRouter.js';
import cors from 'cors';
dotenv.config();

await connectDB();

//CORS
// const whitelist=["https://127.0.0.1:5500"];
// app.use((req,res,next)=>{
//     console.log(req.header("origin"));
//     if(req.originalUrl.includes("/auth/activate_account")){
//         res.setHeader("Access=Control-Allow-Origin","*");
//         res.setHeader("Access=Control-Allow-Methods","GET");
//         return next(); 
//     }
//     if(!whitelist.includes(req.header(req.header("origin")))){
//         return next(new Error("Blocked by CORS!"));
//     }
//     res.setHeader("Access=Control-Allow-Origin","*");
//     res.setHeader("Access=Control-Allow-Headers","*");
//     res.setHeader("Access=Control-Allow-Methods","*");
//     res.setHeader("Access=Control-Private-Network","*");    
//         return next();
// })

//allow access from everywhere
app.use(cors());

//morgan
app.use(morgan("combined"))

//parsing
app.use(express.json())
app.use('/auth',authRouter);
app.use('/category',categoryRouter);
app.use('/subCategory',subCategoryRouter);
app.use('/brand',brandRouter);
app.use('/coupon',couponRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/review',reviewRouter);
app.all('*', (req, res,next) =>{
    return next(new Error("Page not found",{cause:404}));
})

app.use( (error,req, res,next) => {
    const statusCode=error.cause||500;
    return res.status(statusCode).json({
        success:false,
        message:error.message,
        stack:error.stack
    });
})



app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:3000`))