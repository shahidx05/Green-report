const express = require("express");
const router = express.Router();

const { upload, uploadImage } = require("../middleware/upload");
const {createReport, getAllReports, getReportById} = require("../controllers/reportController");

router.post("/create",upload.single("image"), uploadImage, createReport);

router.get("/all", getAllReports);

router.get("/track/:id", getReportById);

module.exports = router;
