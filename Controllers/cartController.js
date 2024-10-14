import Cart from "../Models/cartModel.js";
import mongoose from "mongoose";
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log(productId,quantity);
  
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const producIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
      if (producIndex > -1) {
        cart.items[producIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.status(200).json({ message: "Product Added To Cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to cart", error });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId", "name description price imageUrl stock category");

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { id: productId } = req.params;
    console.log("Product ID:", productId);
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log("Current cart items:", cart.items);
    const updatedItems=cart.items.filter((item)=>item.productId.toString() !== productId)
    if(cart.items.length===updatedItems.length){
        return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.items=updatedItems;
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

export const clearCart=async(req,res)=>{
    const userId=req.user.id;
    try {
        const cart =await Cart.findOne({userId});
    if(!cart){
        return res.status(404).json({ message: "Cart not found" });
    }
    cart.items=[];
    await cart.save(); 
    res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
       res.status(500).json({message:"Failed to Clear cart"})
    }
}

export const updateCartQuantity=async(req,res)=>{
    const {productId,quantity}=req.body;
    const userId= req.user.id;
    try {
        let cart=await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        const producIndex=cart.items.findIndex((item)=>item.productId.toString()===productId);
    if(producIndex> -1){
        cart.items[producIndex].quantity=quantity;
        await cart.save();
        res.status(200).json({message : "Quantity updated"})
    }else{
        return res.status(404).json({ message: "Product not found in cart" }); 
    }
    } catch (error) {
        res.status(500).json({ message: "Failed to update quantity"});
    }
}