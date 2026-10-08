const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    questions: [
      {
        type: String,
        required: true,
      },
    ],

    answers: [
      {
        type: String,
        required: true,
      },
    ],

    evaluations: [
      {
        overallScore: Number,
        technicalAccuracy: Number,
        communication: Number,
        relevance: Number,
        confidence: Number,

        strengths: [String],
        weaknesses: [String],

        feedback: String,
        improvement: String,
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);