import mongoose from "mongoose";

export const DBCONNECT = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("mongoDB Connected..");
        }).catch(error => {
            console.log(error);
        })
}