const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop"
    },
    image: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    },
    confidence: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detection", detectionSchema);