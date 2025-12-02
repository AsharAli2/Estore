import express from "express";
import { ProductModel } from "../models/ProductModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { protect } from "../middleware/auth.js";
import { Review } from "../models/Review.js";

const productrouter = express.Router();

// Combined products endpoint supporting pagination, category, search and sort
productrouter.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pagesize = Math.max(1, parseInt(req.query.pagesize || '10', 10));
        const category = req.query.category;
        const search = req.query.search;
        const sort = req.query.sort; // e.g. price_asc, price_desc, rating_desc
        const brand = req.query.brand; // single brand or comma separated
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
        const minRating = req.query.minRating ? parseFloat(req.query.minRating) : undefined;

        const filter = {};
        if (category) {
            filter.Category = category;
        }

        let useTextScore = false;
        if (search) {
            const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.name = { $regex: new RegExp(escaped, 'i') };
        }

        if (brand) {
            const brands = String(brand).split(',').map(b => b.trim()).filter(Boolean);
            if (brands.length === 1) filter.Brand = { $regex: new RegExp(`${brands[0]}`, 'i') };
            else filter.Brand = { $in: brands.map(b => new RegExp(b, 'i')) };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = minPrice;
            if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }

        if (minRating !== undefined) {
            filter.averageRating = { $gte: minRating };
        }

        // total count for pagination
        const total = await ProductModel.countDocuments(filter);

        // build sort
        let query = ProductModel.find(filter).select('-Embeddings');
        if (useTextScore && !sort) {
            query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        } else if (sort === 'price_asc') {
            query = query.sort({ price: 1 });
        } else if (sort === 'price_desc') {
            query = query.sort({ price: -1 });
        } else if (sort === 'rating_desc') {
            query = query.sort({ averageRating: -1 });
        } else {
            // default sort by newest (Mongo _id contains creation time)
            query = query.sort({ _id: -1 });
        }

        const products = await query.skip((page - 1) * pagesize).limit(pagesize).exec();

        res.json({ products, count: total, page, pagesize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

productrouter.get('/allproducts', async (req, res) => {

    const allproducts = await ProductModel.find({}).select('-Embeddings');
    if (allproducts.length) {
        res.send({ Product: allproducts })
    }
    else {
        res.send('No products available')

    }
});


productrouter.post('/review/:id', protect, async (req, res) => {


    try {
        const { review, rating, userName } = req.body;

        const newReview = new Review({
            productId: req.params.id,
            review,
            rating,
            userName,
        });

        await newReview.save();

        // ✅ After saving the review, recalculate average rating
        const reviews = await Review.find({ productId: req.params.id });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;

        console.log(averageRating);
        console.log(reviews);



        // ✅ Update product document
        await ProductModel.findByIdAndUpdate(req.params.id, {
            averageRating,
            ratingCount: reviews.length
        });

        res.status(201).json({ newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add review" });
    }





});
productrouter.get('/review/:id', async (req, res) => {
    try {

        const reviews = await Review.find({ productId: req.params.id });
        res.json({ reviews });

    } catch (error) {
        res.status(500).json({ error: "Failed to add review" });
    }
});

productrouter.get('/Category/:name', async (req, res) => {
    const name = req.params.name

    const allproducts = await ProductModel.find({ Category: name })
    if (allproducts.length) {
        res.send({ Product: allproducts })
    }
    else {
        res.send('No products available')

    }
});
productrouter.get('/Category/:name/:filter', async (req, res) => {
    const name = req.params.name
    const filter = req.params.filter
    if (filter === "Low") {

        const allproducts = await ProductModel.find({ Category: name }).sort({ price: 1 })
        if (allproducts.length) {
            res.send({ Product: allproducts })
        }
        else {
            res.send('No products available')

        }
    }
    else {
        const allproducts = await ProductModel.find({ Category: name }).sort({ price: -1 })
        if (allproducts.length) {
            res.send({ Product: allproducts })
        }
        else {
            res.send('No products available')

        }
    }
});
productrouter.post('/add', protect, async (req, res) => {
    const name = req.body.name
    const price = req.body.price
    const image = req.body.image
    const description = req.body.description
    const Brand = req.body.brand
    const Category = req.body.category
    const quantity = req.body.quantity
    const productdata = { name, price: +price, image, description, Brand, Category, quantity: +quantity };
    const productInstance = new ProductModel(productdata)
    const savedProduct = await productInstance.save()

    res.send({ message: "product added", Product: savedProduct })
});

productrouter.put('/edit/:id', protect, async (req, res) => {
    const productID = req.params.id;
    const product = await ProductModel.findOne({ _id: productID })
    if (product) {
        product.name = req.body.name
        product.price = req.body.price
        product.image = req.body.image
        product.description = req.body.description
        const savedProduct = await product.save()
        res.send({ message: "product edited", Product: savedProduct })
    } else {
        res.send({ message: "product not found" })

    }
});
productrouter.delete('/:id', protect, async (req, res) => {
    const productID = req.params.id;
    try {
        const Product = await ProductModel.deleteOne({ _id: productID })
        res.send({ message: "found", Product: Product })

    } catch (error) {
        res.send({ message: error })
    }
});



productrouter.get('/:id', async (req, res) => {

    const productID = req.params.id;
    const product = await ProductModel.findOne({ _id: productID })

    res.send({ message: "product Found", product: product })
});

export { productrouter }