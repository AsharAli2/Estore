import 'dotenv/config'; // load .env before the Gemini client below is created
import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { OrderModel } from '../models/OrderModel.js';
import { ProductModel } from '../models/ProductModel.js';
import { UserModel } from '../models/user.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getSystemInstruction = (Products) => {
  return `
---
ROLE: Product Recommendation and Summarization Assistant
---

You are an expert product recommender. Your primary goal is to analyze the user's **current intent** (derived from the content/conversation history) and provide a concise, highly relevant set of p[...]

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
3.  **Image Integrity:** Use the 'product.image' value *EXACTLY* as provided. No modification or fabrication.
4.  **Link Integrity:** The link must use 'product._id' exactly: 'https://estore-frontend-jade.vercel.app/Product/' + 'product._id'.
5.  **No Hallucination:** Do not create or guess any values that are not present in the input Products[].
6.  **No Match:** If no products are relevant to the user's current intent, the 'products' array should be empty ('[]').
7.  **Hard Requirements (budget & features):** Treat any price limit (e.g. "under $100") and any explicit feature (e.g. "wireless", "4K", "noise cancelling", a brand or category) as MUST-HAVE conditions. Only judge them from the data in Products[] (price, name, description). If the data does not clearly show a product has the requested feature, do NOT claim it does.
8.  **When Nothing Fits:** If NO product satisfies all must-have conditions, do NOT present products as if they match. Start the 'summary' by plainly saying that nothing in the store matches exactly (e.g. "We don't have wireless headphones under $100"). You may then list up to 3 of the closest alternatives from Products[], and each 'reason' MUST state honestly how it falls short (e.g. "Wireless, but $249 – over your budget" or "Under $100, but wired"). Never hide the mismatch.

Context Products[]: ${JSON.stringify(Products)}
`;
};
// Retry transient Gemini errors (503 overloaded, 429 rate limit) with backoff
const generateWithRetry = async (params, attempts = 3) => {
  for (let i = 0; ; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      const retryable = err?.status === 503 || err?.status === 429;
      if (!retryable || i >= attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
};

// Conversation history is NOT stored on the server (it is serverless and shared by all users).
// The client sends its own prior turns with every request; we validate and cap them here.
const MAX_HISTORY_TURNS = 10;
const MAX_TURN_CHARS = 4000;
const buildContents = (clientHistory, query) => {
  const prior = Array.isArray(clientHistory) ? clientHistory : [];
  const turns = prior
    .filter((m) => m && typeof m.text === "string" && m.text.trim() && (m.role === "user" || m.role === "ai" || m.role === "model"))
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text.slice(0, MAX_TURN_CHARS) }],
    }));
  // Gemini requires the conversation to start with a user turn
  while (turns.length && turns[0].role !== "user") turns.shift();
  turns.push({ role: "user", parts: [{ text: query.slice(0, MAX_TURN_CHARS) }] });
  return turns;
};

const chatRouter_V2 = express.Router();

// Generate and store product embeddings
chatRouter_V2.post('/prodEmbedding', protect, async (req, res) => {

  try {
    const docs = await ProductModel.where('Embeddings').size(0).exec();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      taskType: "RETRIEVAL_DOCUMENT",
      apiKey: process.env.GEMINI_API_KEY
    });

    // Embed only the meaningful text, in batches
    const toText = (d) => [d.name, d.Brand, d.Category, d.description].filter(Boolean).join(". ");
    for (let i = 0; i < docs.length; i += 20) {
      const batch = docs.slice(i, i + 20);
      const vectors = await embeddings.embedDocuments(batch.map(toText));
      await ProductModel.bulkWrite(
        batch.map((d, j) => ({
          updateOne: { filter: { _id: d._id }, update: { $set: { Embeddings: vectors[j] } } },
        }))
      );
    }

    res.status(201).send({
      message: `successfully created ${docs.length} product embeddings`,

    });

  } catch (error) {
    console.error('Embedding Error:', error);
    res.status(500).send({ message: "Failed to create product embeddings" });
  }
})

// get products using vector search
chatRouter_V2.post('/VectorSearch', async (req, res) => {

  try {
    const { query, history: clientHistory } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).send({ message: "query is required" });
    }
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001", // updated model
      taskType: "RETRIEVAL_QUERY",
      apiKey: process.env.GEMINI_API_KEY
    });
    const queryEmbedding = await embeddings.embedQuery(String(query));
    const getResponse = await ProductModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "Embeddings",
          queryVector: queryEmbedding, // array of numbers
          numCandidates: 100,
          limit: 8
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

    const AIResponse = await generateWithRetry({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: buildContents(clientHistory, query),
      config: {
        systemInstruction: system,
      }
    });

    const AIResponseText = AIResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!AIResponseText) throw new Error("Empty response from model");

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
