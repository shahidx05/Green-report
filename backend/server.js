const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const cors = require("cors");

const allowedOrigins = [
  "https://trash-trace.vercel.app",
  "https://trash-trace.netlify.app/",  // your new frontend URL
  "http://localhost:5173",            // Vite dev
  "http://localhost:3000"             // CRA or other local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);              // Postman, curl, mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);                         // Allow listed origins
    }
    return callback(new Error("Not allowed by CORS"));     // Block others
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
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
