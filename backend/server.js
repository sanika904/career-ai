const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const OpenAI = require("openai");
const connectDB = require("./config/db");
const Interview = require("./models/Interview");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

connectDB();

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "CareerAI Backend is running 🚀",
  });
});

// =====================================================
// RESUME UPLOAD + AI ANALYSIS
// =====================================================

app.post(
  "/api/resume/upload",
  upload.single("resume"),
  async (req, res) => {
    let filePath = null;

    try {
      // Check file
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume",
        });
      }

      filePath = req.file.path;

      // Read uploaded PDF
      const fileBuffer = fs.readFileSync(filePath);

      // Extract PDF text
      const parser = new PDFParse({
        data: fileBuffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      // Ask AI to analyze resume
      const aiResponse = await openai.responses.create({
        model: "gpt-5.6-luna",

        input: `
You are an expert resume and career analyst.

Analyze the following resume for an entry-level software developer.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

The JSON must have exactly this structure:

{
  "resumeScore": 0,
  "atsScore": 0,
  "skillsMatch": 0,
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ],
  "recommendation": "overall recommendation"
}

Rules:

- resumeScore must be a number between 0 and 100.
- atsScore must be a number between 0 and 100.
- skillsMatch must be a number between 0 and 100.
- strengths must contain exactly 3 items.
- weaknesses must contain exactly 3 items.
- suggestions must contain exactly 3 items.
- Base the analysis only on the resume content.
- Do not invent experience, skills, education, or achievements.

Resume:

${result.text}
        `,

        text: {
          format: {
            type: "json_object",
          },
        },
      });

      console.log("\nAI ANALYSIS:");
      console.log(aiResponse.output_text);

      // Convert AI JSON text into JavaScript object
      let analysis;

      try {
        analysis = JSON.parse(aiResponse.output_text);
      } catch (parseError) {
        console.error("AI JSON parsing error:", parseError);

        return res.status(500).json({
          message: "AI returned an invalid JSON response",
          text: result.text,
          aiRawResponse: aiResponse.output_text,
        });
      }

      // Delete uploaded file after processing
      fs.unlinkSync(filePath);
      filePath = null;

      // Send result to frontend
      res.json({
        message: "Resume analyzed successfully ✅",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        text: result.text,
        analysis: analysis,
      });
    } catch (error) {
      console.error("Resume processing error:", error);

      // Delete file if something failed
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.status(500).json({
        message: "Failed to analyze resume",
        error: error.message,
      });
    }
  }
);

// =====================================================
// AI MOCK INTERVIEW EVALUATION
// =====================================================

// =====================================================
// AI MOCK INTERVIEW ANSWER EVALUATION
// =====================================================

app.post("/api/interview/evaluate", async (req, res) => {
  try {
    const { role, difficulty, question, answer } = req.body;

    if (!role || !difficulty || !question || !answer) {
      return res.status(400).json({
        message: "Role, difficulty, question and answer are required",
      });
    }

    const aiResponse = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: `
You are an expert technical interviewer.

Evaluate a candidate's answer for a software developer interview.

Candidate Role:
${role}

Difficulty:
${difficulty}

Interview Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

The JSON must have exactly this structure:

{
  "overallScore": 0,
  "technicalAccuracy": 0,
  "communication": 0,
  "relevance": 0,
  "confidence": 0,
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2"
  ],
  "feedback": "short personalized feedback",
  "improvement": "specific suggestion for improvement"
}

Rules:

- Every score must be a number between 0 and 100.
- strengths must contain exactly 2 items.
- weaknesses must contain exactly 2 items.
- Evaluate only the answer provided by the candidate.
- Do not invent information.
- Be fair and suitable for an entry-level software developer.
- Focus on technical accuracy, clarity, relevance and communication.
      `,

      text: {
        format: {
          type: "json_object",
        },
      },
    });

    console.log("\nINTERVIEW AI EVALUATION:");
    console.log(aiResponse.output_text);

    let evaluation;

    try {
      evaluation = JSON.parse(aiResponse.output_text);
    } catch (parseError) {
      console.error("Interview JSON parsing error:", parseError);

      return res.status(500).json({
        message: "AI returned an invalid JSON response",
        aiRawResponse: aiResponse.output_text,
      });
    }

    res.json({
      message: "Interview answer evaluated successfully ✅",
      evaluation: evaluation,
    });

  } catch (error) {
    console.error("Interview evaluation error:", error);

    res.status(500).json({
      message: "Failed to evaluate interview answer",
      error: error.message,
    });
  }
});

app.post("/api/interview/generate-questions", async (req, res) => {
  try {
    const { resumeText, role, difficulty } = req.body;

    if (!resumeText || !role || !difficulty) {
      return res.status(400).json({
        message: "Resume text, role and difficulty are required",
      });
    }

    const aiResponse = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: `
You are an expert technical interviewer.

Generate interview questions for a candidate based ONLY on their resume.

Candidate Role:
${role}

Difficulty:
${difficulty}

Resume:
${resumeText}

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

The JSON must have exactly this structure:

{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}

Rules:

- Generate exactly 5 questions.
- Questions must be personalized to the candidate's resume.
- Ask about projects, skills, technologies, education or experience mentioned in the resume.
- Match the selected role and difficulty.
- Do not invent anything that is not present in the resume.
- Questions should be suitable for an entry-level software developer.
      `,
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const questions = JSON.parse(aiResponse.output_text);

    res.json({
      message: "Personalized interview questions generated successfully",
      questions: questions.questions,
    });
  } catch (error) {
    console.error("Question generation error:", error);

    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
});

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

    const interview = new Interview({
      role,
      difficulty,
      questions,
      answers,
      evaluations,
      overallScore,
    });

    await interview.save();

    res.status(201).json({
      message: "Interview result saved successfully ✅",
      interview,
    });
  } catch (error) {
    console.error("Interview save error:", error);

    res.status(500).json({
      message: "Failed to save interview result",
      error: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`CareerAI Backend running on port ${PORT}`);
});