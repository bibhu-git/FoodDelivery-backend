import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {

        const { userId, items, amount, address } = req.body;
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Create new order in database
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
        });
        await newOrder.save();

        // Clear user's cart after placing order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Create line items for Stripe checkout session
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80 // Only multiply by 100 for INR
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80 // Delivery charges in INR (multiply by 100)
            },
            quantity: 1
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Send session URL back to the frontend
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Error in placeOrder", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not paid" })
        }
    } catch (error) {
        console.log("Error in verifyOrder " + error)
        res.json({ success: false, message: "Error" })
    }
}
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log("Error in userOrder " + error)
        res.json({ success: false, message: "Error" })
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log("Error in listOrders " + error)
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {

    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log("Error in updateStatus " + error)
        res.json({ success: false, message: "Error" })
    }

}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
