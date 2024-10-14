import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.PASSMAIL,
        pass:process.env.PASSKEY
    }
});

const sendConfirmationEmail=async (to,orderDetails)=>{
    const mailOptions={
        from:process.env.PASSMAIL,
        to,
        subject:'Order Confirmation',
        html:`
        <h1>Your Order has been Confirmed!</h1>
         <p>Thank you for your order. Here are your order details:</p>
        <ul>
             ${orderDetails.map(item => `<li>${item.product.name} - Quantity: ${item.quantity}</li>`).join('')}
           </ul>
            <p>Total Amount: Rs. ${orderDetails.totalPrice}</p>
           <p>We will notify you when your order is out for delivery.</p>
         `
    }
    return transporter.sendMail(mailOptions);
}

export default sendConfirmationEmail