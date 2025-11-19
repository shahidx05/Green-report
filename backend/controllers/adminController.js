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
exports.updateReport = async (req, res) => {
  try {
    // Extract all possible fields to update
    const { 
      status: newStatus, 
      workerId: newWorkerId, 
      description, 
      severity, 
      city, 
      address 
    } = req.body;
    
    const reportId = req.params.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // --- Store old values for logic ---
    const oldStatus = report.status;
    const oldWorkerId = report.assignedWorker ? report.assignedWorker.toString() : null;

    // --- 1. Update General Details (If provided) ---
    if (description) report.description = description;
    if (severity) report.severity = severity;
    if (city) report.city = city;
    if (address) report.address = address;

    // --- 2. Update Status ---
    if (newStatus) {
      if (!["Pending", "Assigned", "Completed", "Declined"].includes(newStatus)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      report.status = newStatus;
    }
    
    // --- 3. Update Assignment ---
    if (newWorkerId) {
      // If admin sends explicit workerId, assign them
      report.assignedWorker = newWorkerId;
      report.status = "Assigned"; 
    } else if (newWorkerId === "") {
       // If admin sends empty string, unassign worker
       report.assignedWorker = null;
       if (report.status === 'Assigned') report.status = 'Pending';
    }

    await report.save();

    // --- 4. Update Worker Counts Logic ---
    const finalWorkerId = report.assignedWorker ? report.assignedWorker.toString() : null;
    const finalStatus = report.status;

    // A. Check if worker changed
    if (finalWorkerId && finalWorkerId !== oldWorkerId) {
      // Increment new worker
      await User.findByIdAndUpdate(finalWorkerId, { $inc: { pendingTaskCount: 1 } });
      // Decrement old worker (if existed)
      if (oldWorkerId) {
        await User.findByIdAndUpdate(oldWorkerId, { $inc: { pendingTaskCount: -1 } });
      }
    } else if (!finalWorkerId && oldWorkerId) {
      // Worker was removed
      await User.findByIdAndUpdate(oldWorkerId, { $inc: { pendingTaskCount: -1 } });
    }
    
    // B. Check if task completed/declined (decrement count)
    // Only if worker didn't change (otherwise logic A handled it)
    if (finalWorkerId === oldWorkerId && finalWorkerId) {
       if (oldStatus === "Assigned" && (finalStatus === "Completed" || finalStatus === "Declined")) {
          await User.findByIdAndUpdate(finalWorkerId, { $inc: { pendingTaskCount: -1 } });
       }
       // If re-opening a task
       if ((oldStatus === "Completed" || oldStatus === "Declined") && finalStatus === "Assigned") {
          await User.findByIdAndUpdate(finalWorkerId, { $inc: { pendingTaskCount: 1 } });
       }
    }

    // Return updated report with populated worker
    const updatedReport = await Report.findById(reportId).populate("assignedWorker", "name email city");

    res.json({
      message: "Report updated successfully",
      report: updatedReport
    });

  } catch (error) {
    console.error("updateReport Error:", error);
    res.status(500).json({ message: "Failed to update report" });
  }
};