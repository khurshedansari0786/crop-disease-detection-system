const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadAndDetect } = require("../controllers/detectionController");

router.post("/", protect, upload.single("image"), uploadAndDetect);

module.exports = router;