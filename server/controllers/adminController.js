const User = require("../models/User");
const Crop = require("../models/Crop");
const Detection = require("../models/Detection");

// Admin Analytics
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalDetections = await Detection.countDocuments();

    res.json({
      totalUsers,
      totalCrops,
      totalDetections
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminAnalytics };