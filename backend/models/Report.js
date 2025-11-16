const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  imageUrl_before: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String },
  city: { type: String, required: true },

  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  status: {
    type: String,
    enum: ["Pending", "Assigned", "Completed", "Declined"],
    default: "Pending"
  },

  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  imageUrl_after: { type: String },
  workerNotes: { type: String }

}, { timestamps: true });


module.exports = mongoose.model("Report", reportSchema);
