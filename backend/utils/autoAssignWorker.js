const User = require("../models/User");
const Report = require("../models/Report");

/*
  Auto-Assign Logic (Improved):
  -----------------------------
  ✔ Case-insensitive matching for city names
  ✔ Trim spaces from city input
  ✔ Sort workers by least pending tasks
  ✔ Auto-assign and update worker count
*/

exports.autoAssignReport = async (report) => {
  try {
    if (!report || !report.city) {
      console.log("AutoAssign ERROR: Report missing city");
      return;
    }

    // Normalize city for safe comparison
    const city = report.city.trim().toLowerCase();

    // 1️⃣ Find eligible workers (case-insensitive match)
    const workers = await User.find({
      role: "Worker",
      isActive: true,
      city: { $regex: new RegExp("^" + city + "$", "i") }  // FIX: ignore casing
    }).sort({
      pendingTaskCount: 1, // Lowest tasks first
      createdAt: 1         // Older worker accounts first
    });

    if (!workers || workers.length === 0) {
      console.log(`⚠️ No available workers in city: ${report.city}`);
      return;
    }

    // 2️⃣ Pick the BEST worker
    const selectedWorker = workers[0];

    // 3️⃣ Assign worker to report
    report.assignedWorker = selectedWorker._id;
    report.status = "Assigned";
    await report.save();

    // 4️⃣ Update worker task count
    await User.findByIdAndUpdate(selectedWorker._id, {
      $inc: { pendingTaskCount: 1 }
    });

    console.log(
      `✅ Auto-Assigned Report ${report._id} → Worker ${selectedWorker.name} (${selectedWorker._id})`
    );

  } catch (error) {
    console.error("AutoAssign ERROR:", error.message);
  }
};
