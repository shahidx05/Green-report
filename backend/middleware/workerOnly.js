const workerOnly = (req, res, next) => {
  try {
    // Must be authenticated first
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "Worker") {
      return res.status(403).json({ message: "Access denied: Workers only" });
    }

    next();

  } catch (error) {
    console.error("workerOnly middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = workerOnly;
