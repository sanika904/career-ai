const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      education: user.education,
      college: user.college,
      skills: user.skills,
      goal: user.goal,
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Unable to fetch profile." });
  }
});
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, education, college, skills, goal } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, location, education, college, skills, goal },
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Profile updated successfully.",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        education: user.education,
        college: user.college,
        skills: user.skills,
        goal: user.goal,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Unable to update profile." });
  }
});

module.exports = router;