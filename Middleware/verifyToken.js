import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const middleWare=(req,res,next)=>{
    const token = req.header('Authorization');
    if(!token){
        return res.status(400).json({message:"Unauthorized Access"})  
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(400).json({message:"Unauthorized Access"})
        }
        req.user=user;
        next();
    })
}
