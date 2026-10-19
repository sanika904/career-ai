
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get logged-in user's settings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      darkMode: user.darkMode,
      notifications: user.notifications,
      emailUpdates: user.emailUpdates,
      language: user.language,
    });
  } catch (error) {
    console.error("Settings fetch error:", error.message);
    res.status(500).json({ message: "Unable to fetch settings." });
  }
});

// Save logged-in user's settings
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { darkMode, notifications, emailUpdates, language } = req.body;

    const updates = {};

    if (typeof darkMode === "boolean") updates.darkMode = darkMode;
    if (typeof notifications === "boolean") updates.notifications = notifications;
    if (typeof emailUpdates === "boolean") updates.emailUpdates = emailUpdates;
    if (typeof language === "string") updates.language = language;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Settings saved successfully.",
      settings: {
        darkMode: user.darkMode,
        notifications: user.notifications,
        emailUpdates: user.emailUpdates,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error.message);
    res.status(500).json({ message: "Unable to save settings." });
  }
});

module.exports = router;
