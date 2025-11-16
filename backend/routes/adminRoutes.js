// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  createWorker,
  getAllReports,
  getAllWorkers,
  updateReportStatus
} = require("../controllers/adminController");

// Admin: Create Worker
router.post("/create-worker", auth, adminOnly, createWorker);

// Admin: Get all reports
router.get("/reports", auth, adminOnly, getAllReports);

// Admin: Get list of workers
router.get("/workers", auth, adminOnly, getAllWorkers);

// Admin: Update report status manually
router.put("/report/status/:id", auth, adminOnly, updateReportStatus);

module.exports = router;
