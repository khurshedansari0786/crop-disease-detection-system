require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cropRoutes = require("./routes/cropRoutes");
const detectionRoutes = require("./routes/detectionRoutes");









const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/detection", require("./routes/detectionRoutes"));

app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/detections", detectionRoutes);

app.get("/", (req, res) => {
  res.send("Backend API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));