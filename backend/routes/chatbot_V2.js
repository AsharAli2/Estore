import express from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/OrderModel.js';
import { ProductModel } from '../models/ProductModel.js';
import { UserModel } from '../models/user.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const chatRouter_V2 = express.Router();

chatRouter_V2.post('/prodEmbedding', async (req, res) => {
        
try {
    const docs = await ProductModel.where('Embeddings').size(0).exec();
Array.isArray(docs)
console.log('documents with 0 tags', docs);
    
// const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004", // 768 dimensions
//       taskType: TaskType.RETRIEVAL_DOCUMENT,
//       title: "Document title",
//     });
  res.status(201).send({
            message: " successfully",
           
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).send({ message: "Failed to process order" });
    }
})


// chatRouter_V2.post('/Chat', protect, async (req, res) => {
//         const { query } = req.body;
// try {
//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004", // 768 dimensions
//       taskType: TaskType.RETRIEVAL_DOCUMENT,
//       title: "Document title",
//     });
    
// } catch (error) {
    
// }

// })

export { chatRouter_V2 }