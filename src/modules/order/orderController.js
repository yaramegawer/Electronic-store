import { Cart } from "../../../DB/models/cartModel.js";
import { Order } from "../../../DB/models/orderModel.js";
import { Product } from "../../../DB/models/productModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from "../../utils/sendEmails.js";
import { updateStock } from "./orderService.js";
import { clearCart } from "./orderService.js";
import Stripe from "stripe";

const __dirname=path.dirname(fileURLToPath(import.meta.url));


export const createOrder=asyncHandler(async(req,res,next)=>{
    const { payment, address, phone } = req.body;

    // Get products from cart
    const cart = await Cart.findOne({ user: req.user._id });
    const products = cart.products;

    if (products.length < 1) return next(new Error("Empty cart!"));

    // Check products and prepare order details
    let orderProducts = [];
    let orderPrice = 0;

    for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        if (!product)
            return next(new Error(`${products[i].productId} product not found!`));

        // Check stock
        if (!product.inStock(products[i].quantity)) 
            return next(new Error(`Product out of stock, only ${product.availableItems} are available for this product ${product.name}`));

        // Add product details to the order
        orderProducts.push({
            name: product.name,
            quantity: products[i].quantity,
            itemPrice: product.price,
            totalPrice: product.price * products[i].quantity,
            productId: product._id,
        });

        orderPrice += product.price * products[i].quantity;
    }

    // Create order in DB
    const order = await Order.create({
        user: req.user._id,
        address,
        phone,
        payment,
        products: orderProducts,
        price: orderPrice,
    });

    // Update stock
    updateStock(order.products, true);

    // Clear cart
    clearCart(req.user._id);

    if (payment === 'visa') {
        // Handle Stripe payment
        const stripe = new Stripe(process.env.STRIPE_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: "http://localhost:5500/", // from frontend
            cancel_url: "http://localhost:5500/",  // from frontend
            line_items: order.products.map((product) => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.name,
                        // images: [product.productId.defaultImage.url]
                    },
                    unit_amount: product.itemPrice * 100,
                },
                quantity: product.quantity,
            })),
        });

        return res.json({
            success: true,
            results: { url: session.url },
        });
    }

    // Send order response
    return res.json({
        success: true,
        results: { order },
    });
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