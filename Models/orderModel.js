// // import mongoose, { mongo } from "mongoose";

// // const orderSchema = mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
// //     orderItems: [
// //       {
// //         name: { type: String, required: true },
// //         quantity: { type: Number, required: true },
// //         price: { type: Number, required: true },
// //         product: {
// //           type: mongoose.Schema.Types.ObjectId,
// //           required: true,
// //           ref: "Product",
// //         },
// //       },
// //     ],
// //     paymentMethod: { type: String, required: true },
// //     totalPrice: { type: Number, required: true },
// //     isPaid: { type: Boolean, default: false },
// //     paidAt: { type: Date },
// //   },
// //   { timestamp: true }
// // );

// // const Order = mongoose.model("Order", orderSchema);
// // export default Order;


// import mongoose, { mongo } from "mongoose";
// const orderSchema = mongoose.Schema(
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
//       orderItems: [
//         {
//           product: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: true,
//             ref: "Product"
//           },
//           name: { type: String, required: true },
//           quantity: { type: Number, required: true, min: 1 },
//           price: { type: Number, required: true },
//         },
//       ],
//       paymentMethod: { type: String, required: true },
//       totalPrice: { type: Number, required: true },
//       isPaid: { type: Boolean, default: false },
//       paidAt: { type: Date },
//       customerDetails: { // Add this field
//         name: { type: String, required: true },
//         address: { type: String, required: true },
//         phone: { type: String, required: true },
//       },
//     },
//     { timestamps: true }
//   );
  
// const Order = mongoose.model("Order", orderSchema);
// export default Order;


import mongoose, { mongo } from "mongoose";
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{ product: String, name: String, quantity: Number, price: Number }],
  totalPrice: { type: Number, required: true },
  customerDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;