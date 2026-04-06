const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const { getAdminAnalytics } = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getAdminAnalytics);

module.exports = router;