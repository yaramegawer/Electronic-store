import { Cart } from "../../../DB/models/cartModel.js";
import { Product } from "../../../DB/models/productModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const addToCart=asyncHandler(async(req,res,next)=>{
    const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found!", { cause: 404 }));
  }

  // Check product stock
  if (!product.inStock(quantity)) {
    return next(
      new Error(`Sorry, only ${product.availableItems} items are available`, { cause: 400 })
    );
  }

  // Check if user already has this product in their cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
const existingProduct = cart.products.find(
  (item) =>
    item.product && item.product._id && item.product._id.toString() === productId.toString()
);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;

      // Check stock again for the total quantity
      if (!product.inStock(newQuantity)) {
        return next(
          new Error(`Sorry, only ${product.availableItems} items are available`, { cause: 400 })
        );
      }

      existingProduct.quantity = newQuantity;
    } else {
      // Push new product if not found in cart
      cart.products.push({ product, quantity });
    }

    await cart.save();
    return res.json({
      success: true,
      results: { cart },
    });
  } else {
    // Create a new cart for the user
    const newCart = await Cart.create({
      user: req.user._id,
      products: [{ product, quantity }],
    });

    return res.json({
      success: true,
      results: { cart: newCart },
    });
  }
});



export const userCart=asyncHandler(async(req,res,next)=>{

    const cart=await Cart.findOne({user:req.user._id});


    return res.json({success:true,results:{cart}});
    
});


export const removeFromCart=asyncHandler(async(req,res,next)=>{
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new Error("Product not found!", { cause: 404 }));
    }
  
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new Error("Cart not found!", { cause: 404 }));
    }
  
    // Find the product inside the cart
    const cartProduct = cart.products.find(
      (item) => item.productId.toString() === productId.toString()
    );
  
    if (!cartProduct) {
      return next(new Error("Product not found in your cart!", { cause: 404 }));
    }
  
    // Decrease the quantity
    cartProduct.quantity -= 1;
  
    if (cartProduct.quantity <= 0) {
      // Remove product from cart if quantity reaches 0
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
    }
  
    await cart.save();
  
    return res.json({
      success: true,
      results: { cart },
    });
});

//I want to clear all products in the cart not delete the cart it must remain available for the user
export const clearCart=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOneAndUpdate(
        {user:req.user._id},
        {products:[]},
        {new:true});
    
    return res.json({
        success:true,
        results:{cart}
    });    
});