
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in first.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    if (!req.userId) {
      return res.status(401).json({
        message: "User ID missing from token.",
      });
    }

    next();
  } catch (error) {
    console.log("JWT VERIFY ERROR:", error.name);
    console.log("JWT VERIFY MESSAGE:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
