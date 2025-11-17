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

router.post("/create-worker", auth, adminOnly, createWorker);

router.get("/reports", auth, adminOnly, getAllReports);

router.get("/workers", auth, adminOnly, getAllWorkers);

router.put("/report/status/:id", auth, adminOnly, updateReportStatus);

module.exports = router;
