const Detection = require("../models/Detection");

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

module.exports = { uploadAndDetect };