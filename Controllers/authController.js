import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "../Models/userModel.js";

dotenv.config();

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExist = await User.findOne({ email }); // Change here
        if (userExist) {
            return res.status(400).json({ message: "User Already Exists" });
        } else {
            const hashPassword = await bcryptjs.hash(password, 10);
            const user = new User({ name, email, password: hashPassword });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to register user' });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const userpassword =await bcryptjs.compareSync(password, user.password);
        if (!userpassword) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to login' });
    }
}
