const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const AuthRoutes = require("./routes/authRoutes");
const patientRoute = require("./routes/patientRoute");
const doctorRoutes = require("./routes/doctorRoutes");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");

// Connect to the database
connectDB();    

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using the auth routes
app.use("/auth", AuthRoutes);

// Using the patient routes
app.use("/patient",patientRoute);

// Using the doctor routes
app.use("/doctor",doctorRoutes);

// Using the Admin Router
app.use("/admin",adminRoutes);

// 404 Error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Starting the server
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
});