const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
const connectDB = () => {
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error(`Error: ${err}`));
}
module.exports = connectDB