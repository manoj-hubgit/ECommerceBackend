// import Order from "../Models/orderModel.js";
// import dotenv from "dotenv";
// import sendConfirmationEmail from "../Services/nodemailer.js";

// dotenv.config();

// export const order = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { orderItems, paymentMethod, totalPrice, customerDetails } = req.body;
//     if (!orderItems || !paymentMethod || !customerDetails || !totalPrice) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     console.log("this is my userId: ", req.user.id);
//     const order = new Order({
//       orderItems,
//       totalPrice,
//       customerDetails,
//       paymentMethod,
//       user: req.user.id,
//     });
//     const savedOrder = await order.save();
//     // const userEmail=req.user.email;
//     // await sendConfirmationEmail(userEmail,{
//     //   orderItems:savedOrder.orderItems,
//     //   totalPrice:savedOrder.totalPrice,
//     // })
//     res.status(200).json({ message: "Order placed successfully", savedOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order. Try again later " });
//   }
// };

// export const orderDisplay = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("orderItems.product", "name price")
//       .populate("user", "name email");
//     res.status(200).json({ message: "order is Displaying successfully",orders});
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching orders"});
//   }
// };

// export const packedStatus = async(req,res)=>{
//   try {
//     const orderId = req.params.id;
//     const order = await Order.findById(orderId);
//     if(!order){
//       return res.status(404).json({ message: "Order not found" });
//     } 
//     order.packed=true;
//     await order.save();
//   } catch (error) {
//     res.status(500).json({ message: "Error updating packed status"});
//   }
// }

import Order from "../Models/orderModel.js";
import dotenv from "dotenv";
import sendConfirmationEmail from "../Services/nodemailer.js";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// // 📌 Create an Order and Generate Razorpay Payment Link
// export const order = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { orderItems, paymentMethod, totalPrice, customerDetails } = req.body;

//     if (!orderItems || !paymentMethod || !customerDetails || !totalPrice) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     console.log("This is my userId: ", req.user.id);

//     // Create a new order in DB
//     const newOrder = new Order({
//       orderItems,
//       totalPrice,
//       customerDetails,
//       paymentMethod,
//       user: req.user.id,
//       isPaid: false, // Mark as unpaid initially
//     });

//     const savedOrder = await newOrder.save();

//     if (paymentMethod === "Online") {
//       // Create a Razorpay Order
//       const options = {
//         amount: totalPrice * 100, // Convert to paise
//         currency: "INR",
//         receipt: savedOrder._id.toString(),
//         payment_capture: 1,
//       };

//       const razorpayOrder = await razorpay.orders.create(options);

//       return res.status(200).json({
//         message: "Order created successfully",
//         orderId: savedOrder._id,
//         razorpayOrderId: razorpayOrder.id,
//         key: process.env.RAZORPAY_KEY_ID, 
//         amount: options.amount,
//         currency: options.currency,
//       });
//     }

//     // Cash on Delivery (COD) order
//     res.status(200).json({ message: "Order placed successfully", savedOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order. Try again later" });
//   }
// };

// 📌 Create an Order and Generate Razorpay Payment Link
export const order = async (req, res) => {
  try {
    const { orderItems, paymentMethod, totalPrice, customerDetails } = req.body;

    if (!orderItems || !paymentMethod || !customerDetails || !totalPrice) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = new Order({
      orderItems,
      totalPrice,
      customerDetails,
      paymentMethod,
      user: req.user.id,
      isPaid: false,
    });

    const savedOrder = await newOrder.save();

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      message: "Order created successfully",
      orderId: savedOrder._id,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: options.amount,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order. Try again later" });
  }
};


// // 📌 Verify Razorpay Payment
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Payment verification failed" });
//     }

//     // Update Order as Paid
//     const order = await Order.findOneAndUpdate(
//       { _id: req.body.orderId },
//       { isPaid: true, paidAt: Date.now(), paymentId: razorpay_payment_id },
//       { new: true }
//     );

//     res.status(200).json({ message: "Payment verified successfully", order });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ message: "Error verifying payment. Try again later" });
//   }
// };

// 📌 Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, paidAt: Date.now(), paymentId: razorpay_payment_id },
      { new: true }
    );

    res.status(200).json({ message: "Payment verified successfully", order });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment. Try again later" });
  }
};

// 📌 Display All Orders
export const orderDisplay = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.product", "name price")
      .populate("user", "name email");

    res.status(200).json({ message: "Orders displayed successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 📌 Update Order Status to "Packed"
export const packedStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.packed = true;
    await order.save();

    res.status(200).json({ message: "Order marked as packed", order });
  } catch (error) {
    console.error("Error updating packed status:", error);
    res.status(500).json({ message: "Error updating packed status" });
  }
};
