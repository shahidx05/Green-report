const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  role: {
    type: String,
    enum: ["Admin", "Worker"],
    required: true
  },

  city: { type: String },
  isActive: { type: Boolean, default: true },

  pendingTaskCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });


userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
