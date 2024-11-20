
const mongoose = require("mongoose");
require('dotenv').config()

    const connectDB =  mongoose.connect(process.env.DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
 

module.exports = {connectDB};
