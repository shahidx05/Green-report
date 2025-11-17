const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const cors = require("cors");

app.use(cors({
  origin: [
    "https://green-report.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
