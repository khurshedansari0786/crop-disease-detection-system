const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      console.log("TOKEN:", token); // debug

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("DECODED:", decoded); // debug

      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ message: "No token" });
    }
  } catch (error) {
    console.log("JWT ERROR:", error.message); // 🔥 IMPORTANT
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;