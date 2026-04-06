const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadAndDetect,
  getMyHistory,
  getUserDashboard
} = require("../controllers/detectionController");


console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);
console.log("uploadAndDetect:", typeof uploadAndDetect);

// Upload + Detect
router.post("/", protect, upload.single("image"), uploadAndDetect);

// Get History
router.get("/my-history", protect, getMyHistory);

// ✅ NEW: User Dashboard
router.get("/dashboard", protect, getUserDashboard);

module.exports = router;