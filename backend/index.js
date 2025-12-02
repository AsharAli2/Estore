


import express from "express";
import mongoose from "mongoose";
import { dashRouter } from "./routes/dashboard.js";
import { router } from "./routes/users.js";
import { productrouter } from "./routes/products.js";
import { orderRouter } from "./routes/order.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import { z } from "zod";
import bodyParser from "body-parser";
import { chatRouter } from "./routes/chatbot.js";
import { ProductModel } from "./models/ProductModel.js";
import { chatRouter_V2 } from "./routes/chatbot_V2.js";

config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.mongoURL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
}));
app.use(bodyParser.json());
app.use(express.json());


// Routers
app.use("/api/user", router);
app.use("/api/mcp", chatRouter);
app.use("/api", chatRouter_V2);
app.use("/api/products", productrouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashRouter);

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

// MCP Server Setup
const server = new McpServer({
    name: "example-server",
    version: "1.0.0",
});
const CategoryEnum = z.enum(["Phone", "Headphone", "Camera", "Laptop"]);


server.tool(
    'getProducts',
    'Get all the products from the database',
    {
        name: z.string().optional(),
        description: z.string().optional(),
        Brand: z.string().optional(),    // ← uppercase
        Category: CategoryEnum.optional(),    // ← uppercase
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        minSold: z.number().optional(),
        minRating: z.number().optional()
    },
    async (args) => {
        const filter = {};

        const textTerms = [];
        if (args.name) textTerms.push(args.name);
        if (args.description) textTerms.push(args.description);

        let useTextSearch = false;
        if (textTerms.length) {
            filter.$text = { $search: textTerms.join(" ") };
            useTextSearch = true;
        }
        if (args.Category) {
            filter.Category = { $regex: new RegExp(`${args.Category}`, "i") };
        }

        if (args.Brand) filter.Brand = args.Brand;
        if (args.minPrice || args.maxPrice) {
            filter.price = {};
            if (args.minPrice) filter.price.$gte = args.minPrice;
            if (args.maxPrice) filter.price.$lte = args.maxPrice;
        }
        if (args.minSold) filter.sold = { $gte: args.minSold };
        if (args.minRating) filter.averageRating = { $gte: args.minRating };


        let query = ProductModel.find(filter);

        if (useTextSearch) {
            query = query
                .select({ score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } });
        }

        const products = await query.lean();

        if (!products.length) {
            return {
                content: [{ type: 'text', text: JSON.stringify([{ message: 'No products match your criteria.' }]) }]
            };
        }

        const items = [{
            type: 'text',
            text: JSON.stringify(products)
        }];
        console.log(items);


        return { content: items };
    }

);



// ✅ New Streamable HTTP Endpoint
app.post("/mcp", async (req, res) => {
    console.log("Handling /mcp with StreamableHTTPServerTransport");
    const transport = new StreamableHTTPServerTransport(req, res);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
        transport.close();
        // server.close();
    });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
