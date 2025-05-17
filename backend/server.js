const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const connectDB = require('./mongoDB');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// for upload resume
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
connectDB();

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/Leave", leaveRoutes);
 

// Root Route
app.get("/", (req, res) => {
  res.send("Assignment API is running...");
});

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
});
 
