import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Signup..");
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "Signup Successful", token: token });

    } catch (error) {
        console.log("Error in Register " + error);
        res.json({ success: false, message: "Error" });
    }
}
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid username!" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password!" })
        }
        const token = createToken(user._id);
        res.json({ success: true, message: "Login Successful🥳", token: token });

    } catch (error) {
        console.log("Error in login")
        res.json({ success: false, message: "Error" })
    }
}

export { registerUser, loginUser };