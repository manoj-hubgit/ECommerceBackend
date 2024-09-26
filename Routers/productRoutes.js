import express from "express";
import { addProduct, getProducts } from "../Controllers/productController.js";
import { middleWare } from "../Middleware/verifyToken.js";


const router=express.Router();

router.post("/addProduct",middleWare,addProduct);
router.get("/getProducts",getProducts);

export default router;