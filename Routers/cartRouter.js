import express, { Router } from "express";
import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from "../Controllers/cartController.js";
import { middleWare } from "../Middleware/verifyToken.js";
const router =express.Router()

router.post("/addCart",middleWare,addToCart);
router.get("/getCart",middleWare,getCart);
router.delete("/clearCart",middleWare,clearCart)
router.delete("/deleteCart/:id",middleWare,removeFromCart);
router.put("/updateQuantity",middleWare,updateCartQuantity);
export default router;