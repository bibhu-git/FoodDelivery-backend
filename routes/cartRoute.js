import express from 'express'
import { addToCart,removeFromCart,getCartItem } from '../controller/cartContoller.js';
import authMiddleware from '../middleware/auth.js';

const cartRoute = express.Router();

cartRoute.post('/add',authMiddleware,addToCart)
cartRoute.post('/remove',authMiddleware,removeFromCart)
cartRoute.get('/get',authMiddleware,getCartItem)

export default cartRoute;
