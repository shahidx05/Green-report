// routes/workerRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const workerOnly = require("../middleware/workerOnly");
const { upload, uploadImage } = require("../middleware/upload");

const {
  getAllWorkerReports,
  updateReportStatusByWorker
} = require("../controllers/workerController");

router.get(
  "/reports",
  auth,
  workerOnly,
  getAllWorkerReports
);

router.put(
  "/update/:id",
  auth,
  workerOnly,
  upload.single("image"), 
  uploadImage,
  updateReportStatusByWorker
);

module.exports = router;
