
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    college: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: String,
      default: "",
      trim: true,
    },

    goal: {
      type: String,
      default: "Software Developer",
      trim: true,
    },

    settings: {
      darkMode: {
        type: Boolean,
        default: true,
      },

      notifications: {
        type: Boolean,
        default: true,
      },

      emailUpdates: {
        type: Boolean,
        default: false,
      },

      language: {
        type: String,
        enum: ["English", "Hindi", "Marathi"],
        default: "English",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
