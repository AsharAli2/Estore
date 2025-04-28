import express from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/OrderModel.js';
import { ProductModel } from '../models/ProductModel.js';
import { UserModel } from '../models/user.js';
import { protect } from '../middleware/auth.js';

const dashRouter = express.Router();

dashRouter.get('/details', protect, async (req, res) => {
    const allorder = await OrderModel.find({})
    // res.send(allorder)

})
dashRouter.get('/Users', protect, async (req, res) => {
    const allUsers = await UserModel.find({})
    res.send({ allUsers: allUsers })

})
dashRouter.get('/Products', protect, async (req, res) => {
    const allProducts = await ProductModel.find({})
    res.send({ allProducts: allProducts })

})

export { dashRouter }