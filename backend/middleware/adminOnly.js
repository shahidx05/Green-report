const adminOnly = (req, res, next) => {
  try {
    // auth.js must run before this → req.user will exist
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
    
  } catch (error) {
    console.error("adminOnly middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminOnly;
