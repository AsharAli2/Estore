const express = require('express')
const mongoose = require('mongoose');
const { OrderModel } = require('../models/OrderModel');
const { ProductModel } = require("../models/ProductModel")
const { UserModel } = require("../models/user")
const protect = require("../middleware/auth")
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

module.exports = dashRouter