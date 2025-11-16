// utils/autoAssignWorker.js

const User = require("../models/User");
const Report = require("../models/Report");

/*
  Auto-Assign Logic:
  ------------------
  1. Find all workers in the same city.
  2. Filter only active workers (isActive = true).
  3. Sort by:
        - pendingTaskCount ASC
        - createdAt ASC (older workers first to avoid blocking)
  4. Assign the worker with the smallest load.
  5. Update:
        - report.assignedWorker
        - report.status = "Assigned"
        - worker.pendingTaskCount + 1
*/

exports.autoAssignReport = async (report) => {
  try {
    if (!report || !report.city) {
      console.log("AutoAssign ERROR: Report missing city");
      return;
    }

    const city = report.city;

    // 1️⃣ Find eligible workers in that city
    const workers = await User.find({
      role: "Worker",
      city,
      isActive: true
    }).sort({
      pendingTaskCount: 1, // Lowest tasks first
      createdAt: 1         // Oldest worker account gets priority
    });

    if (!workers || workers.length === 0) {
      console.log(`No available workers in city: ${city}`);
      return;
    }

    // 2️⃣ Pick the BEST worker
    const selectedWorker = workers[0];

    // 3️⃣ Assign the worker to the report
    report.assignedWorker = selectedWorker._id;
    report.status = "Assigned";

    await report.save();

    // 4️⃣ Increase worker pendingTaskCount
    await User.findByIdAndUpdate(selectedWorker._id, {
      $inc: { pendingTaskCount: 1 }
    });

    console.log(
      `Auto-Assigned Report ${report._id} → Worker ${selectedWorker.name} (${selectedWorker._id})`
    );

  } catch (error) {
    console.error("AutoAssign ERROR:", error.message);
  }
};
