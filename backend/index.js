const express = require("express")
const mongoose = require("mongoose")
const { UserModel } = require("./models/user")
const app = express();
const dashRouter = require("./routes/dashboard");
const router = require("./routes/users");
const productrouter = require("./routes/products");
const orderRouter = require("./routes/order");
var cors = require('cors');
const path = require("path");
require("dotenv").config();

const bodyParser = require("body-parser");
router.use(bodyParser.json());


mongoose.connect(process.env.mongoURL)
    .then(() => console.log('Connected!'));

app.use(express.json());

const corsOptions = {
    origin: process.env.client_url,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}
// const _dirname = path.resolve();

app.use(cors(corsOptions));
app.use("/api/user", router)
app.use("/api/products", productrouter)
app.use("/api/order", orderRouter)
app.use("/api/dashboard", dashRouter)
app.get("/", (req, res) => {
    res.send("hello")
})




// app.use(express.static(path.join(_dirname, '/frontend/dist')));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
// })
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("server is running"))
