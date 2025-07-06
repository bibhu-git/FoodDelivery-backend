import foodModel from "../models/foodModel.js";
import fs from 'fs';

const addFood = async (req, res) => {
    const image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({
            success: true,
            message: "Food Added"
        })
    } catch (error) {
        console.log("Error in addFood " + error);
        res.json({ success: false, message: "Error" });
    }
}

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({
            success: true,
            data: foods
        })
    } catch (error) {
        console.log("Error in listFood " + error);
        res.json({
            success: false,
            message: "Error"
        })
    }

}
const removeFood = async (req, res) => {
    try {
        const id = req.body.id;
        const food = await foodModel.findById(id);
        fs.unlink(`uploads/${food.image}`, () => { });
        await foodModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Food Removed"
        })
    } catch (error) {
        console.log("Error in removeFood " + error);
        res.json({
            success: false,
            message: "Error"
        })
    }

}
export { addFood, listFood, removeFood };