const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const helmet = require("helmet")
const { rateLimit } = require("express-rate-limit");

dotenv.config();
const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
// Middleware setup (order matters!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter)


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);


const authRoute = require("./routes/authRoute");



app.use("/auth", authRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server listening at " + port);
});
