const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // ⬅ use config file

// Multer: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Upload middleware
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const result = await uploadToCloudinary(req.file.buffer);
    req.fileUrl = result.secure_url;

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadImage,
};
