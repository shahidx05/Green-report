// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      console.log("❗ Admin already exists. No new admin created.");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123",  // will be hashed automatically
      role: "Admin",
      city: "Global"         // optional (not used for admin)
    });

    console.log("✅ Admin Created Successfully!");
    console.log("Login Details:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);

    process.exit(0);

  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
