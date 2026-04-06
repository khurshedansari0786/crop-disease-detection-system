const Detection = require("../models/Detection");

// Upload + Detect
const uploadAndDetect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const detection = await Detection.create({
      user: req.user._id,
      image: imagePath,
      result: "Healthy",
      confidence: 92.5
    });

    res.status(201).json({
      message: "Detection completed",
      detection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Detection History
const getMyHistory = async (req, res) => {
  try {
    const history = await Detection.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW: User Dashboard
const getUserDashboard = async (req, res) => {
  try {
    const totalScans = await Detection.countDocuments({
      user: req.user._id
    });

    const healthy = await Detection.countDocuments({
      user: req.user._id,
      result: "Healthy"
    });

    const diseased = await Detection.countDocuments({
      user: req.user._id,
      result: { $ne: "Healthy" }
    });

    res.json({
      totalScans,
      healthy,
      diseased
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndDetect,
  getMyHistory,
  getUserDashboard
};