// routes/reportRoutes.js
const express = require("express");
const router = express.Router();

const { upload, uploadImage } = require("../middleware/upload");
const {
  createReport,
  getAllReports,
  getReportById
} = require("../controllers/reportController");

// -----------------------------------------
// Public Route: Submit a new waste report
// -----------------------------------------
router.post(
  "/create",
  upload.single("image"),   // Accept image file
  uploadImage,              // Send to Cloudinary
  createReport              // Controller logic
);

// -----------------------------------------
// Public Route: Get all reports (for map markers)
// -----------------------------------------
router.get("/all", getAllReports);

// -----------------------------------------
// Public Route: Track report by ID
// Example: /api/reports/track/65af302bd71a
// -----------------------------------------
router.get("/track/:id", getReportById);

module.exports = router;
