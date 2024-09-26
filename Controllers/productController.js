import Product from "../Models/productModel.js";
import cloudinary from "../Services/cloudinary.js";

export const addProduct= async(req,res)=>{
    const { name, description, price, stock, image } = req.body;

    try {
        const result=await cloudinary.uploader.upload(image,{folder:'products'});
        const product=new Product({name,
            description,
            price,
            stock,
            imageUrl: result.secure_url,});
            await product.save();  
            res.status(200).json({message:"Product added successfully"})
    } catch (error) {
        res.status(500).json({ message: 'Internal server Failed to add product' });
    }
}


export const getProducts= async(req,res)=>{
    try {
        const {category,search}=req.query;
        let filter ={};
        if(category){
            filter.category=category;
        }
        if(search){
            filter.name={$regex:search,$options:'i'}; //making a case insensitive seaching
        }
        const product=await Product.find(filter);
        res.status(200).json({message:"Product retrived successfully",result:product})
    } catch (error) {
        res.status(500).json({ message: 'Internal server Failed to add product' });
    }
}