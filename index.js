import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import cors from "cors";
import authRoutes from "./Routers/authRoutes.js";
import productRoutes from "./Routers/productRoutes.js";
import orderRoutes from "./Routers/orderRoutes.js"
dotenv.config();
const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
connectDB();

const PORT = process.env.PORT;

app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/order",orderRoutes);

app.get("/",(req,res)=>{
    res.send("App is running Successfully");
})

app.listen(PORT,()=>{
    console.log("App is running in the port");
})