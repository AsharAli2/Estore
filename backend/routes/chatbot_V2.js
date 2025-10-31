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

    docs.map(async(item,key)=>{

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey:process.env.GEMINI_API_KEY
    });

const prodembedding=await embeddings.embedQuery(JSON.stringify(docs[key]));
const updatedProduct = await ProductModel.findByIdAndUpdate(
        item._id,
        { Embeddings: prodembedding },
    );

    })

  res.status(201).send({
            message: `successfully created ${docs.length} product embeddings`,
           
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).send({ message: "Failed to process order" });
    }
})


chatRouter_V2.post('/Chat', protect, async (req, res) => {
        const { query } = req.body;
try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
   model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey:process.env.GEMINI_API_KEY
    });
    
} catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to chat" });
}

})

export { chatRouter_V2 }