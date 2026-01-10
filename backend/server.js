const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const AuthRoutes = require("./routes/authRoutes");
const patientRoute = require("./routes/patientRoute");
const doctorRoutes = require("./routes/doctorRoutes");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const rateLimiter = require("express-rate-limit");

// Connect to the database
connectDB();    

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter Middleware
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

// Using the auth routes
app.use("/auth",limiter , AuthRoutes);

// Using the patient routes
app.use("/patient",limiter ,patientRoute);

// Using the doctor routes
app.use("/doctor",limiter ,doctorRoutes);

// Using the Admin Router
app.use("/admin",limiter ,adminRoutes);

// 404 Error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});


app.use(errorHandler);

// Starting the server
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
});