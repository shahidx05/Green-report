const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Init express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));          // Admin + Worker login
app.use("/api/reports", require("./routes/reportRoutes"));     // User report routes
app.use("/api/admin", require("./routes/adminRoutes"));        // Admin functionality
app.use("/api/worker", require("./routes/workerRoutes"));      // Worker endpoints

// Test route
app.get("/", (req, res) => {
  res.send("GreenReport Backend Running...");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
