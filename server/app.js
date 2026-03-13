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

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// })
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
const courseRoute = require("./routes/courseRoute");
const lecturerRoute = require("./routes/lecturerRoute")
const paymentRoute = require("./routes/paymentRoute")
const cartRoute = require("./routes/cartRoute")
const userRoute = require("./routes/userRoute")
const aiRoute = require("./routes/aiRoute")
const reviewRoute = require("./routes/reviewRoute")
const adminRoute = require("./routes/adminRoute")
const courseCompletionRoute = require("./routes/courseCompletionRoute")

// Set up routes
app.use("/api", courseRoute);
app.use("/auth", authRoute);
app.use("/api", lecturerRoute)
app.use("/api", reviewRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/cart", cartRoute)
app.use("/api/profile", userRoute)
app.use("/api/ai", aiRoute)
app.use("/api", adminRoute)
app.use("/api", courseCompletionRoute)


app.use("/api/uploads", express.static("uploads"));
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server listening at " + port);
});
