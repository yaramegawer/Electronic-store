import express from 'express';
const app = express();
import morgan from 'morgan';
import {connectDB} from './DB/connection.js';
import dotenv from 'dotenv';
import authRouter from './src/modules/auth/authRouter.js';
import productRouter from './src/modules/product/productRouter.js';
import cartRouter from './src/modules/cart/cartRouter.js';
import orderRouter from './src/modules/order/orderRouter.js';
import cors from 'cors';
dotenv.config();

await connectDB();

//CORS

//allow access from everywhere
app.use(cors());

//morgan
app.use(morgan("combined"))

//parsing
app.use(express.json())
app.use('/auth',authRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
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