const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const OpenAI = require("openai");

const connectDB = require("./config/db");
const Interview = require("./models/Interview");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API =
  process.env.PYTHON_API || "http://127.0.0.1:8000";



// Allow requests from any device / laptop on the network
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// Login, signup, profile and settings routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);

const upload = multer({
  dest: "uploads/",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function callPython(endpoint, body) {
  const response = await fetch(`${PYTHON_API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Python API returned an invalid response (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `Python API failed with status ${response.status}`
    );
  }

  return data;
}



function toSkillNames(list) {
  if (!Array.isArray(list)) return [];

  return list
    .map((skill) => {
      if (typeof skill === "string") {
        return skill.trim();
      }

      return typeof skill?.name === "string"
        ? skill.name.trim()
        : "";
    })
    .filter(Boolean);
}



app.get("/", (req, res) => {
  res.json({
    message: "CareerAI Backend is running 🚀",
  });
});


app.post(
  "/api/resume/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    let filePath = null;
    let parser = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume",
        });
      }

      filePath = req.file.path;

      console.log("Resume upload userId:", req.userId);
      console.log(
        "MongoDB connection state:",
        require("mongoose").connection.readyState
      );

      // Extract text from PDF
      const fileBuffer = fs.readFileSync(filePath);

      parser = new PDFParse({
        data: fileBuffer,
      });

      const pdfResult = await parser.getText();
      const resumeText = pdfResult.text;

      await parser.destroy();
      parser = null;

      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({
          message: "No readable text found in the PDF.",
        });
      }

      // 1. Run both AI analyses at the same time (faster).
      // Resume analysis is required. Skills analysis is optional,
      // so resume scores are still returned if it fails.
      const [resumeResult, skillsResult] =
        await Promise.allSettled([
          callPython("/analyze-resume", {
            resume_text: resumeText,
          }),
          callPython("/analyze-skills", {
            resume_text: resumeText,
            target_role: "Full Stack Developer",
          }),
        ]);

      if (resumeResult.status === "rejected") {
        throw resumeResult.reason;
      }

      const analysis = resumeResult.value.analysis;

      if (!analysis) {
        throw new Error(
          "Python service returned no resume analysis."
        );
      }

      // Career goal and skills already returned by resume analysis.
      // The roadmap is built around this goal, so it is the
      // single source of truth for the career goal.
      const analysisGoal =
        typeof analysis.suggestedCareerGoal === "string"
          ? analysis.suggestedCareerGoal.trim()
          : "";

      let skillsUpdated = false;
      let profileUpdateMessage =
        "Resume analysis completed, but profile was not updated.";
      let extractedSkills = toSkillNames(
        analysis.extractedSkills
      );
      let suggestedGoal = analysisGoal;

      try {
        if (skillsResult.status === "rejected") {
          throw skillsResult.reason;
        }

        const skillsAnalysis = skillsResult.value.analysis;

        if (!skillsAnalysis) {
          throw new Error(
            "Python service returned no skills analysis."
          );
        }

        // Prefer the detailed skills analysis when it has skills
        const detailedSkills = toSkillNames(
          skillsAnalysis.skills
        );

        if (detailedSkills.length > 0) {
          extractedSkills = detailedSkills;
        }

        const skillsGoal =
          typeof skillsAnalysis.suggestedCareerGoal === "string"
            ? skillsAnalysis.suggestedCareerGoal.trim()
            : "";

        suggestedGoal = analysisGoal || skillsGoal;
      } catch (skillsError) {
        console.error(
          "Skills analysis error:",
          skillsError.message
        );

        profileUpdateMessage = skillsError.message;
      }

      // 2. Update the user's profile
      try {
        const user = await User.findById(req.userId);

        if (!user) {
          throw new Error(
            `User not found for authenticated ID: ${req.userId}`
          );
        }

        if (extractedSkills.length > 0) {
          user.skills = extractedSkills.join(", ");
        }

        if (suggestedGoal) {
          user.goal = suggestedGoal;
        }

        if (extractedSkills.length > 0 || suggestedGoal) {
          await user.save();
          skillsUpdated = true;
          profileUpdateMessage =
            "Profile skills and career goal updated successfully.";
        } else {
          profileUpdateMessage =
            "No new skills or career goal were returned by AI.";
        }
      } catch (profileError) {
        console.error(
          "Profile update error:",
          profileError.message
        );

        profileUpdateMessage = profileError.message;
      }

      
      analysis.extractedSkills = extractedSkills;
      analysis.suggestedCareerGoal = suggestedGoal || null;

      if (!Array.isArray(analysis.roadmap)) {
        analysis.roadmap = [];
      }

      console.log("Resume analysis completed.");

      // 4. Return analysis to frontend
      return res.json({
        message: "Resume analyzed successfully ✅",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        text: resumeText,
        analysis,
        skillsUpdated,
        extractedSkills,
        suggestedCareerGoal: suggestedGoal,
        profileUpdateMessage,
      });
    } catch (error) {
      console.error(
        "Resume processing error:",
        error.message
      );

      return res.status(500).json({
        message: "Failed to analyze resume",
        error: error.message,
      });
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch (error) {
          console.error(
            "PDF parser cleanup error:",
            error.message
          );
        }
      }

      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(
            "Uploaded PDF cleanup error:",
            error.message
          );
        }
      }
    }
  }
);



app.post("/api/skills/analyze", async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;

    if (
      typeof resume_text !== "string" ||
      !resume_text.trim()
    ) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    const data = await callPython("/analyze-skills", {
      resume_text,
      target_role: target_role || "Full Stack Developer",
    });

    return res.json(data);
  } catch (error) {
    console.error("Skill analysis error:", error.message);

    return res.status(500).json({
      message: "Failed to analyze skills",
      error: error.message,
    });
  }
});



app.post("/api/interview/evaluate", async (req, res) => {
  try {
    const { role, difficulty, question, answer } = req.body;

    if (
      !role ||
      !difficulty ||
      !question ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        message:
          "Role, difficulty, question and answer are required",
      });
    }

    const aiResponse = await openai.responses.create({
      
      model: process.env.OPENAI_MODEL || "gpt-6-luna",

      input: `
You are an expert technical interviewer.

Evaluate a candidate's answer for a software developer interview.

Candidate Role: ${role}
Difficulty: ${difficulty}
Interview Question: ${question}
Candidate Answer: ${answer}

Return only valid JSON, without markdown or code fences.

Use exactly this structure:
{
  "overallScore": 0,
  "technicalAccuracy": 0,
  "communication": 0,
  "relevance": 0,
  "confidence": 0,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "feedback": "short personalized feedback",
  "improvement": "specific suggestion for improvement"
}

Rules:
- All scores must be numbers between 0 and 100.
- strengths must contain exactly 2 items.
- weaknesses must contain exactly 2 items.
- Evaluate only the candidate's answer.
- Do not invent information.
- Be fair to an entry-level software developer.
- Focus on accuracy, clarity, relevance and communication.
      `,

      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const evaluation = JSON.parse(
      aiResponse.output_text
    );

    console.log("Interview evaluation completed.");

    return res.json({
      message: "Interview answer evaluated successfully ✅",
      evaluation,
    });
  } catch (error) {
    console.error(
      "Interview evaluation error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to evaluate interview answer",
      error: error.message,
    });
  }
});


app.post(
  "/api/interview/generate-questions",
  async (req, res) => {
    try {
      const { resumeText, role, difficulty } = req.body;

      if (!resumeText || !role || !difficulty) {
        return res.status(400).json({
          message:
            "Resume text, role and difficulty are required",
        });
      }

      const data = await callPython(
        "/generate-interview-questions",
        {
          resume_text: resumeText,
          role,
          difficulty,
        }
      );

      return res.json(data);
    } catch (error) {
      console.error(
        "Question generation error:",
        error.message
      );

      return res.status(500).json({
        message: "Failed to generate interview questions",
        error: error.message,
      });
    }
  }
);



app.post("/api/interview/save", async (req, res) => {
  try {
    const {
      role,
      difficulty,
      questions,
      answers,
      evaluations,
      overallScore,
    } = req.body;

    if (
      !role ||
      !difficulty ||
      !Array.isArray(questions) ||
      !Array.isArray(answers) ||
      !Array.isArray(evaluations)
    ) {
      return res.status(400).json({
        message: "Invalid interview result data",
      });
    }

    const interview = new Interview({
      role,
      difficulty,
      questions,
      answers,
      evaluations,
      overallScore,
    });

    await interview.save();

    return res.status(201).json({
      message: "Interview result saved successfully ✅",
      interview,
    });
  } catch (error) {
    console.error("Interview save error:", error.message);

    return res.status(500).json({
      message: "Failed to save interview result",
      error: error.message,
    });
  }
});



app.get("/api/python-test", async (req, res) => {
  try {
    const response = await fetch(PYTHON_API);

    const text = await response.text();

    return res.status(response.status).send(text);
  } catch (error) {
    return res.status(500).json({
      message: "Python service connection failed",
      error: error.message,
    });
  }
});



app.post("/api/python-resume-analysis", async (req, res) => {
  try {
    const { resume_text } = req.body;

    if (
      typeof resume_text !== "string" ||
      !resume_text.trim()
    ) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    const data = await callPython("/analyze-resume", {
      resume_text,
    });

    return res.json(data);
  } catch (error) {
    console.error(
      "Python resume analysis error:",
      error.message
    );

    return res.status(500).json({
      message: "Python resume analysis failed",
      error: error.message,
    });
  }
});


async function startServer() {
  try {
    await connectDB();

    // "0.0.0.0" lets other laptops on the same network connect
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `CareerAI Backend running on port ${PORT} 🚀`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start CareerAI backend:",
      error.message
    );

    process.exit(1);
  }
}

startServer();