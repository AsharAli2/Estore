import mongoose from "mongoose"
const prodschema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    Brand: String,
    Category: String,
    Embeddings:Array,
    quantity: Number,
    averageRating: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },


})

prodschema.index(
    { name: "text", description: "text", Category: "text" },
    {
        default_language: "english", name: "ProductTextIndex", weights: {
            name: 5,
            description: 3,
            Category: 2
        } }
);

const ProductModel = mongoose.model("Product", prodschema)

export { ProductModel }