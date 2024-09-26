import Order from "../Models/orderModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const order = async (req, res) => {
  const { orderItems, paymentMethod, totalPrice, customerDetails } = req.body;
  if (!orderItems || !totalPrice || !customerDetails || !paymentMethod) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const user=req.user;
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if(!user){
    return res.status(401).json({ error: "User not authenticated" });
  }
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No Items Selected" });
  }

  try {
    const order = new Order({
      orderItems,
      paymentMethod,
      totalPrice,
      customerDetails,
      user: user._id,
    });
    const createdOrder = await order.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.PASSMAIL,
        pass: process.env.PASSKEY,
      },
    });
    const mailOptions = {
      from: process.env.PASSMAIL,
      to: process.env.PASSMAIL,
      subject: "New order Placed",
      text: `Thank you for your order! An order has been placed for a total of RS.${totalPrice}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Order placed but failed to send email." });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({ result: createdOrder });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Error placing order. Try again later " });
  }
};
