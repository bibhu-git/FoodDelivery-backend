import express from 'express';
import cors from 'cors';
import { DBCONNECT } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';
import cartRoute from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT ||  4000;
//middleware
app.use(express.json());
app.use(cors({
  origin: 'https://food-delivery-frontend-two-gamma.vercel.app',
  credentials: true,
}));
app.use("/api/food",foodRouter);
app.use("/api/user",userRouter);
app.use("/image",express.static("uploads"));
app.use('/api/cart',cartRoute);
app.use('/api/order',orderRouter);

//Database connection
DBCONNECT();

app.get('/', (req,res) => {
    res.send("Hello world");
})

app.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`);
})