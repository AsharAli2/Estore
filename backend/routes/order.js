

import express from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/OrderModel.js';

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


export { orderRouter };