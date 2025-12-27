require("dotenv").config();
const mongoose = require("mongoose");

const mongoConnect = async () => {
 
    return await mongoose.connect(process.env.MONGO_URI);
   
};
mongoConnect()
module.exports = mongoConnect;