import Order from "../Models/orderModel.js";
import dotenv from "dotenv";
import sendConfirmationEmail from "../Services/nodemailer.js";

dotenv.config();

export const order = async (req, res) => {
  try {
    console.log(req.body);
    const { orderItems, paymentMethod, totalPrice, customerDetails } = req.body;
    if (!orderItems || !paymentMethod || !customerDetails || !totalPrice) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    console.log("this is my userId: ", req.user.id);
    const order = new Order({
      orderItems,
      totalPrice,
      customerDetails,
      paymentMethod,
      user: req.user.id,
    });
    const savedOrder = await order.save();
    // const userEmail=req.user.email;
    // await sendConfirmationEmail(userEmail,{
    //   orderItems:savedOrder.orderItems,
    //   totalPrice:savedOrder.totalPrice,
    // })
    res.status(200).json({ message: "Order placed successfully", savedOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order. Try again later " });
  }
};

export const orderDisplay = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.product", "name price")
      .populate("user", "name email");
    res.status(200).json({ message: "order is Displaying successfully",orders});
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders"});
  }
};

export const packedStatus = async(req,res)=>{
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if(!order){
      return res.status(404).json({ message: "Order not found" });
    } 
    order.packed=true;
    await order.save();
  } catch (error) {
    res.status(500).json({ message: "Error updating packed status"});
  }
}