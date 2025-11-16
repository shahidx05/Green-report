// controllers/reportController.js

const Report = require("../models/Report");
const axios = require("axios");

// --- This will be your auto-assignment logic from utils ---
// We're importing it here to show where it will be used.
const { autoAssignReport } = require("../utils/autoAssignWorker"); 

// OPTIONAL: Reverse Geocoding (Nominatim)
const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    // Return a useful, short part of the address
    return res.data.display_name || "Address not found"; 
  } catch (err) {
    console.log("Address lookup failed:", err.message);
    return ""; // Return empty string on failure, don't block the report
  }
};

// -----------------------------------------------------
// 1️⃣ CREATE REPORT (Public)
// -----------------------------------------------------
exports.createReport = async (req, res) => {
  try {
    const { description, city, severity, lat, lng, address } = req.body;
    const imageUrl = req.fileUrl; // From uploadImage middleware

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (!city || !lat || !lng) {
      return res.status(400).json({ message: "City and location are required" });
    }

    // Auto-detect address if not provided
    let finalAddress = address;
    if (!finalAddress) {
      finalAddress = await getAddressFromCoords(lat, lng);
    }

    // 1. Create the report in the DB
    const newReport = new Report({
      imageUrl_before: imageUrl,
      description,
      city,
      address: finalAddress,
      severity: severity || "Low",
      location: { lat, lng },
      status: "Pending" // Starts as "Pending"
    });
    
    await newReport.save();

    // --- 2. (IMPROVEMENT) ---
    // Now that the report is saved, call the auto-assignment logic.
    // This will run in the background (no need to 'await' it)
    // It will find the best worker and update the report.
    autoAssignReport(newReport); 

    // 3. Send the ID back to the user immediately.
    res.status(201).json({
      message: "Report submitted successfully. We are assigning a worker.",
      reportId: newReport._id, // user will track using this
    });

  } catch (error) {
    console.error("createReport Error:", error);
    res.status(500).json({ message: "Server error creating report" });
  }
};

// -----------------------------------------------------
// 2️⃣ GET ALL REPORTS (Public - Map Markers)
// -----------------------------------------------------
exports.getAllReports = async (req, res) => {
  try {
    // --- (IMPROVEMENT) ---
    // Find all reports that are NOT "Declined"
    const reports = await Report.find({ 
      status: { $ne: 'Declined' } 
    }).sort({ createdAt: -1 }); // newest first

    res.json(reports);

  } catch (error) {
    console.error("getAllReports Error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// -----------------------------------------------------
// 3️⃣ GET REPORT BY ID (Public - Track Report)
// -----------------------------------------------------
exports.getReportById = async (req, res) => {
  try {
    // This function is perfect. No changes needed.
    const report = await Report.findById(req.params.id)
      .populate("assignedWorker", "name email city"); // Populates worker info

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);

  } catch (error) {
    console.error("getReportById Error:", error);
    // Handle invalid MongoDB ID errors
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(500).json({ message: "Failed to fetch report" });
  }
};