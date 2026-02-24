const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image: String,
  disease: String,
  confidence: String
}, { timestamps: true });

module.exports = mongoose.model("Detection", detectionSchema);