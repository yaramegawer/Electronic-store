import { Cart } from "../../../DB/models/cartModel.js";
import { Coupon } from "../../../DB/models/couponModel.js";
import { Order } from "../../../DB/models/orderModel.js";
import { Product } from "../../../DB/models/productModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";
import createInvoice from "../../utils/pdfInvoice.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from "../../utils/sendEmails.js";
import { updateStock } from "./orderService.js";
import { clearCart } from "./orderService.js";
import Stripe from "stripe";

const __dirname=path.dirname(fileURLToPath(import.meta.url));


export const createOrder=asyncHandler(async(req,res,next)=>{
    //data
    const {payment,address,coupon,phone}=req.body;

    //check coupon
    let checkCoupon;
    if(coupon)
    {
        checkCoupon=await Coupon.findOne({
            name:coupon,
            expiredAt:{$gt:Date.now()}
        });
    }

    if(!checkCoupon)
        return next(new Error("Invalid coupon!",{cause:404}));

    //get products from cart
    const cart=await Cart.findOne({user:req.user._id});
    const products=cart.products;
    if(products.length<1) return next(new Error("Empty cart!"));

    //check products
    let orderProducts=[];
    let orderPrice=0;

    for (let i=0;i<products.length;i++){
        const product=await Product.findById(products[i].productId);
        if(!product)
            return next(new Error(`${products[i].productId} product not found!`));
        //check stock
        if(!product.inStock(products[i].quantity)) return next(new Error(`Product out of stock, only ${product.availableItems} are available for this product ${product.name} `));

        orderProducts.push({
            name:product.name,
            quantity:products[i].quantity,
            itemPrice:product.finalPrice,
            totalPrice:product.finalPrice*products[i].quantity,
            productId:product._id,
        });
        orderPrice+=product.finalPrice * products[i].quantity;
    };

    //create order in Db
    const order=await Order.create({
        user:req.user._id,
        address,
        phone,
        payment,
        products:orderProducts,
        price:orderPrice,
        coupon:{
            id:checkCoupon?._id,
            name:checkCoupon?.name,
            discount:checkCoupon?.discount,
        }
    });

    //create invoice
    const user=req.user;
    const invoice = {
    shipping: {
        name: user.userName,
        address: order.address,
        country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,//before discount
    paid: order.finalPrice,//after discount
    invoice_nr: order._id};

    const pdfPath=path.join(__dirname,`./../../tempInvoices/${order._id}.pdf`)
    createInvoice(invoice,pdfPath);

    //upload cloudinary
    const {secure_url,public_id}=await cloudinary.uploader.upload(pdfPath,{folder:`${process.env.CLOUD_FOLDER_NAME}/order/invoices`});

    //add invoice in DB "file" url,id
    order.invoice={url:secure_url,id:public_id};
    await order.save();

    //send email to user "invoice"
    const isSent=await sendEmail({
        to:user.email,
        subject:"Order Invoice",
        attachments:[{path:secure_url,contentType:"application/pdf"}]})

    if(!isSent) return next(new Error("Something went wrong!"));
    //update stock
    updateStock(order.products,true);

    //clear cart
    clearCart(user._id);

    if(payment=='visa'){
        //stripe gateway
        const stripe=new Stripe(process.env.STRIPE_KEY);
        //coupon stripe
        let couponExisted;
        if(order.coupon.name!==undefined){
            couponExisted=await stripe.coupons.create({
                percent_off:order.coupon.discount,
                duration:"once",
            });
        }

        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            success_url:"http://localhost:5500/"/*from frontend */,
            cancel_url:"http://localhost:5500/"/*from frontend */,
            line_items:order.products.map((product)=>{
                return{
                    price_data:{
                        currency:"egp",
                        product_data:{
                            name:product.name,
                            //images:[product.productId.defaultImage.url]
                            }
                        ,unit_amount:product.itemPrice*100,
                    },
                    quantity:product.quantity,
                }
            }),
            discounts:couponExisted?[{coupon:couponExisted.id}]:[],
        }); 
        //send response
        return res.json({
            success:true,
            results:{url:session.url}
    });

    }

    //send response
    return res.json({
        success:true,
        results:{order}
    })
});

export const cancelOrder=asyncHandler(async(req,res,next)=>{
    //check order
    const order=await Order.findById(req.params.id);
    if(!order) return next(new Error("Invalid order id!",{cause:400}));

    //check status
    if(order.status==='delivered' || order.status==='shipped' ||order.status==='canceled') 
        return next(new Error("Can't cancel the order now"));
    
    //cancel order
    order.status="canceled";
    await order.save();

    //update stock
    updateStock(order.products,false)

    //send response
    return res.json({
        success:true,
        message:"order canceled!"
    })
})