// routes/workerRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const workerOnly = require("../middleware/workerOnly");
const { upload, uploadImage } = require("../middleware/upload");

const {
  getAssignedReports,
  updateReportStatusByWorker
} = require("../controllers/workerController");

// -----------------------------------------
// 1️⃣ Worker: View all assigned reports
// -----------------------------------------
router.get(
  "/assigned",
  auth,
  workerOnly,
  getAssignedReports
);

// -----------------------------------------
// 2️⃣ Worker: Update report status (Completed / Declined)
// Uploads completion image if provided
// -----------------------------------------
router.put(
  "/update/:id",
  auth,
  workerOnly,
  upload.single("image"),   // optional: worker uploads completion photo
  uploadImage,
  updateReportStatusByWorker
);

module.exports = router;
