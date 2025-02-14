const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    Email: String,
    Phone: Number,
    Address: String,
    products: Array,

},
    {
        timestamps: true
    })

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };