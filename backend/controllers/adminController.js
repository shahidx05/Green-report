// controllers/adminController.js

const User = require("../models/User");
const Report = require("../models/Report");
// bcrypt is not needed here, only in createWorker. Good.

// -----------------------------------------------------
// 1️⃣ CREATE WORKER (Admin only) - (This function is perfect, no changes)
// -----------------------------------------------------
exports.createWorker = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const worker = await User.create({
      name,
      email,
      password, // will auto-hash from User model
      city,
      role: "Worker"
    });

    res.status(201).json({
      message: "Worker created successfully",
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        city: worker.city,
      }
    });

  } catch (error) {
    console.error("createWorker Error:", error);
    res.status(500).json({ message: "Server error creating worker" });
  }
};

// -----------------------------------------------------
// 2️⃣ GET ALL REPORTS (Admin panel) - (This function is perfect, no changes)
// -----------------------------------------------------
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("assignedWorker", "name email city")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    console.error("getAllReports Error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// -----------------------------------------------------
// 3️⃣ GET ALL WORKERS (Admin panel) - (This function is perfect, no changes)
// -----------------------------------------------------
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "Worker" })
      .select("-password")
      .sort({ pendingTaskCount: 1 }); // Smart!

    res.json(workers);

  } catch (error){
    console.error("getAllWorkers Error:", error);
    res.status(500).json({ message: "Failed to fetch workers" });
  }
};

// -----------------------------------------------------
// 4️⃣ UPDATE REPORT STATUS (Admin manual override) - (IMPROVED)
// -----------------------------------------------------
exports.updateReportStatus = async (req, res) => {
  try {
    const { status: newStatus, workerId: newWorkerId } = req.body;
    const reportId = req.params.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // --- Store old values for comparison ---
    const oldStatus = report.status;
    const oldWorkerId = report.assignedWorker ? report.assignedWorker.toString() : null;

    // --- Update the report ---
    if (newStatus) {
      if (!["Pending", "Assigned", "Completed", "Declined"].includes(newStatus)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      report.status = newStatus;
    }
    
    if (newWorkerId) {
      report.assignedWorker = newWorkerId;
      report.status = "Assigned"; // Assigning a worker automatically sets status to Assigned
    }

    await report.save();

    // --- (THE FIX) Update Worker Counts ---
    const finalWorkerId = report.assignedWorker ? report.assignedWorker.toString() : null;
    const finalStatus = report.status;

    // 1. Check if a worker was *newly assigned* or *changed*
    if (finalWorkerId && finalWorkerId !== oldWorkerId) {
      // Add +1 to the new worker's count
      await User.findByIdAndUpdate(finalWorkerId, { $inc: { pendingTaskCount: 1 } });
      // If there was an old worker, remove -1 from their count
      if (oldWorkerId) {
        await User.findByIdAndUpdate(oldWorkerId, { $inc: { pendingTaskCount: -1 } });
      }
    }
    
    // 2. Check if a task was *completed* or *declined*
    if (oldStatus === "Assigned" && (finalStatus === "Completed" || finalStatus === "Declined")) {
      // Remove -1 from the (old) worker's count
      if (oldWorkerId) {
        await User.findByIdAndUpdate(oldWorkerId, { $inc: { pendingTaskCount: -1 } });
      }
    }

    res.json({
      message: "Report updated successfully",
      report
    });

  } catch (error) {
    console.error("updateReportStatus Error:", error);
    res.status(500).json({ message: "Failed to update report" });
  }
};