
import express from 'express';
import { config } from "dotenv";
config();
import { GoogleGenAI } from '@google/genai';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
const chatRouter = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const history = []

const system = `
You are an AI assistant that helps users find,compare and learn about products.

You receive a stringified JSON list of product objects.
Each product has these fields: _id, name, price, image, description, quantity, Brand, Category, sold, averageRating, ratingCount, score.

Your tasks:

1. Parse the string into a list of product objects.
2. If product information is available:
    - First, show the product names and descriptions using proper HTML bullet points:

    Example format:
    <ul>
      <li><b>{name}</b>: {description}</li>
      <li><b>{name}</b>: {description}</li>
      ...
    </ul>

3. Then, display all products as image cards in a flex layout.
    - Each card must include:
        - Product image (use 'image' field) inside <img> tag.
        - Product name and price inside <p> tags with <b> styling.



4. If no products are available, politely inform the user.

5. You may also suggest:
    - Visiting the product page: 
      <a href="https://estore-frontend-jade.vercel.app/Product/{_id}">View Product</a>
    - Adding to cart.

6. Be concise, friendly, and helpful.

7.If the user asks to compare products, highlight differences in features, price, and specifications clearly and you can also fetch product details from outside sources. Use a structured comparison format such as a HTML table .

Example card layout:

<div style="display: flex; flex-wrap: wrap; gap: 15px;justify-content: center;margin-top: 10px;">
  <div style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; width: 150px; text-align: center;">
    <img src="{image}" alt="{name}" style="border-radius: 20px; height: 100px; width: 100px;" />
    <p><b>{name}</b></p>
    <p>Price: Rs {price}</p>
    <a href="https://estore-frontend-jade.vercel.app/Product/{_id}">View Product</a>
  </div>
</div>

Example comparison format:

<table border="1" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr>
      <th>Feature</th>
      <th>{Product 1 Name}</th>
      <th>{Product 2 Name}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Price</td>
      <td>Rs {price1}</td>
      <td>Rs {price2}</td>
    </tr>
    <tr>
      <td>Brand</td>
      <td>{brand1}</td>
      <td>{brand2}</td>
    </tr>
    <tr>
      <td>Average Rating</td>
      <td>{averageRating1} / 5</td>
      <td>{averageRating2} / 5</td>
    </tr>
    <!-- More rows if necessary -->
  </tbody>
</table>

`

chatRouter.post('/chat', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Missing question or userId" });
    }

    try {
        const mcpClient = new Client({ name: "example-server", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(new URL(`${process.env.MCP_URL}`));
        await mcpClient.connect(transport);

        const tools = (await mcpClient.listTools()).tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: {
                type: tool.inputSchema.type,
                properties: tool.inputSchema.properties,
                required: tool.inputSchema.required
            }
        }));



        // Add user question
        history.push({
            role: "user",
            parts: [{ text: question, type: "text" }]
        });

        // Generate response
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: history,
            config: {
                systemInstruction: system,
                tools: [{ functionDeclarations: tools }],

            }
        });

        const functionCall = response.candidates[0]?.content?.parts[0]?.functionCall;


        const AIresponse = response.candidates[0]?.content?.parts[0]?.text;
        console.log(functionCall);

        if (functionCall) {
            history.push({
                role: "model",
                parts: [{ text: `Calling tool: ${functionCall.name}`, type: "text" }]
            });

            const toolResult = await mcpClient.callTool({
                name: functionCall.name,
                arguments: functionCall.args
            });
            console.log(JSON.parse(toolResult.content[0].text));

            history.push({
                role: "user",
                parts: [{ text: `Tool Result: ${toolResult.content[0].text}`, type: "text" }]
            });

            const updatedResponse = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: history,
                config: {
                    systemInstruction: system,
                    tools: [{ functionDeclarations: tools }]
                }
            });
            const updatedAIresponse = updatedResponse.candidates[0]?.content?.parts[0]?.text;

            history.push({
                role: "model",
                parts: [{ text: updatedAIresponse, type: "text" }]
            });

            return res.json({ AIresponse: updatedAIresponse });
        }

        // Regular text response
        history.push({
            role: "model",
            parts: [{ text: AIresponse, type: "text" }]
        });

        res.json({ AIresponse });

    } catch (error) {
        console.error('Error processing chat:', error.message, error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { chatRouter };
