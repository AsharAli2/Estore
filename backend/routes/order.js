// const express = require('express');
// const mongoose = require('mongoose');
// const { OrderModel } = require('../models/OrderModel');

// const orderRouter = express.Router();

// orderRouter.post('/checkout', async (req, res) => {

//     userName = req.body.userName;
//     products = req.body.products;
//     const data = await OrderModel.findOne({ userName })

//     if (data) {
//         const dataexist = await OrderModel.updateOne({ userName }, { $push: { products } })
//         res.send({ message: "wow" })
//     }
//     else {
//         const newdata = new OrderModel({ userName, products })
//         const saveorder = await newdata.save()
//         res.send({ Message: "succesfully" })
//     }
// })

// orderRouter.get('/history/:userName', async (req, res) => {
//     userName = req.params.userName

//     const allhistory = await OrderModel.findOne({ userName })

//     if (allhistory) {
//         res.send({ history: allhistory })
//     }
//     else {

//         res.send('No History')

//     }
// })
// module.exports = orderRouter

const express = require('express');
const mongoose = require('mongoose');
const { OrderModel } = require('../models/OrderModel');
const Review = require('../models/Review');

const orderRouter = express.Router();

// Updated checkout endpoint
orderRouter.post('/checkout', async (req, res) => {
    try {
        const { username, products, totalPrice } = req.body;

        // Validate required fields
        if (!username || !products || !totalPrice) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        // Create new order
        const newOrder = new OrderModel({
            username: username,
            products: products.map(product => ({
                productName: product.productName,
                imageUrl: product.imageUrl,
                quantity: product.quantity,
                price: product.price
            })),
            totalPrice: totalPrice
        });

        // Save the order
        const savedOrder = await newOrder.save();

        res.status(201).send({
            message: "Order placed successfully",
            orderId: savedOrder._id
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).send({ message: "Failed to process order" });
    }
});

// Get order history
orderRouter.get('/history/:userName', async (req, res) => {
    try {
        const { userName } = req.params;

        // Find all orders for the user
        const orders = await OrderModel.find({ username: userName })
            .sort({ date: -1 }); // Sort by most recent first

        if (orders.length > 0) {
            res.send({
                message: "Orders found",
                orders: orders.map(order => ({
                    id: order._id,
                    date: order.date,
                    totalPrice: order.totalPrice,
                    products: order.products
                }))
            });
        } else {
            res.status(404).send({ message: "No order history found" });
        }

    } catch (error) {
        console.error('Order History Error:', error);
        res.status(500).send({ message: "Failed to fetch order history" });
    }
});


module.exports = orderRouter;