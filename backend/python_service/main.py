import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class ResumeRequest(BaseModel):
    resume_text: str


class InterviewRequest(BaseModel):
    role: str
    difficulty: str
    question: str
    answer: str


@app.get("/")
def home():
    return {
        "message": "CareerAI Python Service is running!"
    }


# Resume Analysis (now also returns career goal, skills and roadmap)
@app.post("/analyze-resume")
def analyze_resume(request: ResumeRequest):
    try:
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"""
Analyze this resume for a fresher software developer.

Return ONLY valid JSON with exactly these fields:
- resumeScore: number from 0 to 100
- atsScore: number from 0 to 100
- skillsMatch: number from 0 to 100
- strengths: exactly 3 strings
- weaknesses: exactly 3 strings
- suggestions: exactly 3 strings
- recommendation: string
- suggestedCareerGoal: string, the best-fit entry-level job role
  based only on this resume (for example "Java Developer" or
  "Frontend Developer"); null if the resume has not enough evidence
- extractedSkills: array of strings, the technical skills actually
  present in the resume
- roadmap: array of exactly 5 objects, each with:
  - title: short step title
  - description: 1 to 2 sentences, specific to this resume
  - status: short label such as "Core Learning", "Practice",
    "Project Building", "Interview Preparation", "Placement Goal"

Rules for roadmap:
- Personalize every step to the skills, gaps, projects and
  suggestedCareerGoal of THIS resume.
- Do not use generic steps that would fit any resume.
- Mention the candidate's real technologies in the descriptions.
- Steps must be in logical order from learning to getting a job.

Base the analysis only on the resume content.
Do not invent skills, experience, education, or achievements.

Resume:
{request.resume_text}
""",
            text={"format": {"type": "json_object"}}
        )

        analysis = json.loads(response.output_text)

        # Make sure the new fields always exist in the expected shape
        if not isinstance(analysis.get("extractedSkills"), list):
            analysis["extractedSkills"] = []

        if not isinstance(analysis.get("roadmap"), list):
            analysis["roadmap"] = []

        if "suggestedCareerGoal" not in analysis:
            analysis["suggestedCareerGoal"] = None

        return {"analysis": analysis}

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# AI Mock Interview Evaluation
@app.post("/evaluate-interview")
def evaluate_interview(request: InterviewRequest):
    try:
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"""
You are an expert technical interviewer.

Evaluate the candidate's answer for a fresher software developer.

Role: {request.role}
Difficulty: {request.difficulty}
Question: {request.question}
Candidate Answer: {request.answer}

Return ONLY valid JSON with exactly these fields:
- suggestedCareerGoal: string or null

- skills: array of objects, each containing:
  - name: actual technical skill found in the resume
  - level: Beginner, Intermediate, or Advanced
  - score: estimated score from 0 to 100 based on resume evidence
  - status: Strong, Good, or Needs Improvement
  - evidence: brief explanation of evidence in the resume

- strengths: array of up to 5 strings
- improvements: array of up to 5 strings
- overallSkillScore: number from 0 to 100
- recommendation: string

Evaluate only the answer provided.
Do not invent information.
Be fair to an entry-level candidate.
""",
            text={"format": {"type": "json_object"}}
        )

        evaluation = json.loads(response.output_text)

        return {
            "message": "Interview answer evaluated successfully",
            "evaluation": evaluation
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# Generate Interview Questions
class GenerateQuestionsRequest(BaseModel):
    resume_text: str
    role: str
    difficulty: str


@app.post("/generate-interview-questions")
def generate_interview_questions(request: GenerateQuestionsRequest):
    try:
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"""
You are an expert technical interviewer.

Generate exactly 5 interview questions based only on the candidate's resume.

Role: {request.role}
Difficulty: {request.difficulty}

Resume:
{request.resume_text}

Return ONLY valid JSON in this format:
{{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}}

Rules:
- Generate exactly 5 questions.
- Personalize them to the resume, role, and difficulty.
- Do not invent skills or experience.
""",
            text={"format": {"type": "json_object"}}
        )

        result = json.loads(response.output_text)

        return {
            "message": "Interview questions generated successfully",
            "questions": result["questions"]
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


class SkillAnalysisRequest(BaseModel):
    resume_text: str
    target_role: str = "Full Stack Developer"


@app.post("/analyze-skills")
def analyze_skills(request: SkillAnalysisRequest):
    try:
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"""
You are an expert technical skill analyzer for software
developer candidates, especially freshers.

Analyze the candidate's resume for the target role.

Target Role: {request.target_role}

Resume:
{request.resume_text}

Return ONLY valid JSON with these fields:

- suggestedCareerGoal: string or null
- skills: array of objects, each containing:
  - name: actual technical skill found in the resume
  - level: Beginner, Intermediate, or Advanced
  - score: estimated score from 0 to 100 based on resume evidence
  - status: Strong, Good, or Needs Improvement
  - evidence: brief explanation of evidence in the resume

- strengths: array of up to 5 strings
- improvements: array of up to 5 strings
- overallSkillScore: number from 0 to 100
- recommendation: string

Rules:
- Extract skills relevant to the target role from the resume.
- Do not always return the same predefined skills.
- Do not invent skills, certifications, or experience.
- Include a skill only when supported by the resume.
- Do not treat a skill's mere mention as proof of expertise.
- Scores are estimates based on resume evidence, not verified
  practical proficiency.
- Suggest a career goal based only on skills, projects, and
  experience supported by the resume.
- Choose a suitable entry-level role only when the resume
  provides enough evidence.
- If there is not enough evidence, return null for
  suggestedCareerGoal.
- If no technical skills can be identified, return an empty
  skills array and set overallSkillScore to 0.
- Keep the output valid JSON.
""",
            text={"format": {"type": "json_object"}}
        )

        result = json.loads(response.output_text)

        return {
            "message": "Skill analysis completed successfully",
            "analysis": result
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )