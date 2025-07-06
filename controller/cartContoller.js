import userModel from "../models/userModel.js";

export const addToCart = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id: req.body.userId})
        const cartData = await userData.cartData;
    
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData}) 
        res.json({success: true, message: "Add to cart"})
    } catch (error) {
        console.log("Error in addToCart "+error)
        res.json({success: false, message: "Error"})
    }

}

export const removeFromCart = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id: req.body.userId})
        const cartData = await userData.cartData;
        if(cartData[req.body.itemId] > 0)
        {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData}) 
        res.json({success: true, message: "remove from cart"})

    } catch (error) {
        console.log("Error in removeFromCart " + error)
        res.json({success: false, message: "Error"})
    }
}

export const getCartItem = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id: req.body.userId})
        if(!userData) {
            return res.json({success: false, message: "User not found"})
        }
        const cartData = await userData.cartData;
        res.json({success: true, cartData})
    } catch (error) {
        console.log("Error in getCartItem "+error)
        res.json({success: false, message: "Error"})
    }
    
}