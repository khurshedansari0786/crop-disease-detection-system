const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createCrop,
  getAllCrops,
} = require("../controllers/cropController");

// Create crop (protected)
router.post("/", protect, upload.single("image"), createCrop);

// Get all crops
router.get("/", getAllCrops);

module.exports = router;