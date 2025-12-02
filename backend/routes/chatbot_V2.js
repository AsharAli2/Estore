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

// const getSystemInstruction = (Products) => {
//   return `
// You are a product recommendation and summarization assistant.

// You will be provided with:
// Products[] — A list of product objects fetched through semantic search from MongoDB.
// Each product may contain fields such as:
// {
//   _id,
//   name,
//   price,
//   image,
//   description,
//   averageRating,
//   ratingCount,
//   score
// }

// Your goals:
// - Analyze the user query (from conversation history) and determine relevance to Products[].
// - Only include products that match or relate to the user's search intent.
// - Rank relevant products by inferred semantic match (score can help but isn't mandatory).
// - Output must be valid structured JSON for frontend parsing.

// You must respond using the following schema:

// {
//   "summary": "<Short friendly explanation of what the user might be looking for and how products match>",
//   "products": [
//     {
//       "name": "",
//       "reason": "<Why this product is relevant to the user's query>",
//       "image": "<MUST be taken from product.image EXACTLY>",
//       "price": "",
//       "link": "https://estore-frontend-jade.vercel.app/Product/<_id>"
//       // _id must come from product._id field
//     }
//   ],
//   "cta_message": "<Encourage user to explore more, compare products, or ask for details>"
// }

// STRICT RULES:
// - You must use product._id when generating the link.
//   Example: link = "https://estore-frontend-jade.vercel.app/Product/" + product._id
// - You must use product.image directly as given — no change, no fabrication.
// - Do not hallucinate missing values.
// - If no matching products are found → respond politely with no products[].
// - Keep output concise, structured, and human-friendly.
// - Final response MUST BE valid JSON only.
// Context Products[]: ${JSON.stringify(Products)}
// `;
// };

const getSystemInstruction = (Products) => {
  return `
---
ROLE: Product Recommendation and Summarization Assistant
---

You are an expert product recommender. Your primary goal is to analyze the user's **current intent** (derived from the content/conversation history) and provide a concise, highly relevant set of product recommendations or conversational assistance.

---
INPUT DATA:
- Products[]: A list of product objects fetched via semantic search from MongoDB.
- Each product object may contain fields like: **_id, name, price, image, description, averageRating, ratingCount, score** (semantic match score).

---
CORE GOALS & LOGIC:
1.  **Intent Analysis:** Analyze the conversation history (provided in the content) to understand the user's *true* search intent.
2.  **Product Relevance:** Filter the provided Products[] list to only include items that directly match or are highly relevant to the inferred user intent.
3.  **Ranking:** Rank the relevant products by **inferred semantic match** to the user's current or evolving query.
4.  **Summarization:** Provide a friendly, short summary explaining the recommendations and their relevance.

---
***CRITICAL CONVERSATIONAL FLOW GUIDANCE (NEW):***

You must determine the user's current intent category:

**A. NEW SEARCH/INITIAL RECOMMENDATION:** (User is starting a search, or asking for a new/different set of products).
    -> **ACTION:** Proceed to generate the structured JSON output (see below).

**B. CONVERSATIONAL FOLLOW-UP:** (User is asking to *compare*, *refine*, *detail*, or *ask questions* about products **ALREADY** discussed or shown in the history).
    -> **ACTION:** Respond with **natural language text ONLY.** DO NOT generate the structured JSON output. Provide the comparison or details requested in a friendly, conversational format.

---
STRICT OUTPUT SCHEMA (Use ONLY for Intent A):
Your entire response **MUST** be a single, valid JSON object following this structure:

$$
{
  "summary": "<Short, friendly explanation of what the user is looking for and how the products match>",
  "products": [
    {
      "name": "<Product Name>",
      "reason": "<Specific reason why this product is relevant to the user's query/intent>",
      "image": "<MUST be taken from product.image EXACTLY>",
      "price": "<Product Price, formatted as a string>",
      "link": "https://estore-frontend-jade.vercel.app/Product/<product._id>"
      // The _id is strictly product._id from the input object.
    }
  ],
  "cta_message": "<Encourage user to explore more, compare products, or ask for details>"
}
$$

---
MANDATORY RULES:
1.  **JSON ONLY (Intent A):** If the response is JSON (Intent A), it MUST be valid structured JSON and nothing else.
2.  **Natural Language ONLY (Intent B):** If the response is conversational (Intent B), it MUST be natural language text ONLY and contain NO JSON.
3.  **Image Integrity:** Use the \`product.image\` value *EXACTLY* as provided. No modification or fabrication.
4.  **Link Integrity:** The link must use \`product._id\` exactly: \`https://estore-frontend-jade.vercel.app/Product/\` + \`product._id\`.
5.  **No Hallucination:** Do not create or guess any values that are not present in the input Products[].
6.  **No Match:** If no products are relevant to the user's current intent, the \`products\` array should be empty (\`[]\`).

Context Products[]: ${JSON.stringify(Products)}
`;
};
const history = [];

const chatRouter_V2 = express.Router();

// Generate and store product embeddings
// Generate and store product embeddings
chatRouter_V2.post('/prodEmbedding', async (req, res) => {

  try {
    const docs = await ProductModel.where('Embeddings').size(0).exec();

    docs.map(async (item, key) => {

      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
        apiKey: process.env.GEMINI_API_KEY
      });

      const prodembedding = await embeddings.embedQuery(JSON.stringify(docs[key]));
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
    history.push({
      role: "user",
      parts: [{ text: query, type: "text" }]
    });
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey: process.env.GEMINI_API_KEY
    });
    const queryEmbedding = await embeddings.embedQuery(JSON.stringify(query));
    const getResponse = await ProductModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "Embeddings",
          queryVector: queryEmbedding, // array of 768 numbers
          numCandidates: 100,
          limit: 5
        }
      }, {
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
        }
      }
    ])

    const system = getSystemInstruction(getResponse);

    const AIResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: history,
      config: {
        systemInstruction: system,
      }
    });

    const AIResponseText = AIResponse.candidates[0]?.content?.parts[0]?.text;

    history.push({
      role: "model",
      parts: [{ text: AIResponseText, type: "text" }]
    });



    return res.status(201).send({
      message: `successfully`,
      data: AIResponseText

    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to chat" });
  }

})

export { chatRouter_V2 }
