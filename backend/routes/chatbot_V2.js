import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { OrderModel } from '../models/OrderModel.js';
import { ProductModel } from '../models/ProductModel.js';
import { UserModel } from '../models/user.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });




const chatRouter_V2 = express.Router();

// Generate and store product embeddings
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

// get products using vector search
chatRouter_V2.post('/VectorSearch', async (req, res) => {
    
    try {
    const { query } = req.body;
    const embeddings = new GoogleGenerativeAIEmbeddings({
   model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey:process.env.GEMINI_API_KEY
    });
    const queryEmbedding=await embeddings.embedQuery(JSON.stringify(query));
    const getResponse= await ProductModel.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "Embeddings",
      queryVector: queryEmbedding, // array of 768 numbers
      numCandidates: 100,
      limit: 3
    }
},{
    $project: {
       name: 1,
        price: 1,
        image: 1,
        description: 1,
        averageRating: 1,
        ratingCount: 1,
        score: {
        $meta: 'vectorSearchScore'
        }          
  }}

])
return  res.status(201).send({
            message: `successfully`,
            data:[]
           
        });
    
} catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to chat" });
}

})

export { chatRouter_V2 }
