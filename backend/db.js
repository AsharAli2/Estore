const mongoose = require('mongoose');

mongoose.connect(process.env.mongoURL)
  .then(() => console.log('Connected!'));

module.exports = { connectdb }