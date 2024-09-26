import express from "express";
import { order } from "../Controllers/orderController.js";
import { middleWare } from "../Middleware/verifyToken.js";

const router= express.Router();

router.post("/orderRoute",middleWare,order);

export default router