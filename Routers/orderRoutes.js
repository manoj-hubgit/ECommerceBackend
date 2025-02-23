import express from "express";
import { order, orderDisplay, packedStatus } from "../Controllers/orderController.js";
import { middleWare } from "../Middleware/verifyToken.js";

const router= express.Router();

router.post("/orderRoute",middleWare,order);
router.get("/orderDisplay",middleWare,orderDisplay);
router.put("/packedStatus/:id",middleWare,packedStatus);
// router.post("/verify-payment",verifyPayment);

export default router