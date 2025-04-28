import mongoose from "mongoose"
const orderSchema = mongoose.Schema({
    products: [{
        productName: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };