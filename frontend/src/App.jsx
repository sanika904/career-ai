import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import AICareerTools from "./components/AICareerTools";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import SkillAnalyzer from "./pages/SkillAnalyzer";
import Applications from "./pages/Applications";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeContext } from "./context/ThemeContext";

import {
  FileText,
  Gauge,
  Target,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

// Everything the app saves in the browser after resume / skills / interview
const CAREER_KEYS = [
  "careerAI_resume_analysis",
  "resumeAnalysis",
  "careerAI_resumeText",
  "careerAI_skillScore",
  "careerAI_skillCount",
  "careerAI_interviewScore",
  "careerAI_jobMatchScore",
  "careerAI_roadmap_progress",
];

function Dashboard() {
  const [userName, setUserName] = React.useState("");
  const [hasResume, setHasResume] = React.useState(false);
  const [resumeScore, setResumeScore] = React.useState(0);
  const [atsScore, setAtsScore] = React.useState(0);
  const [jobMatchScore, setJobMatchScore] = React.useState(0);
  const [skillScore, setSkillScore] = React.useState(0);
  const [skillCount, setSkillCount] = React.useState(0);
  const [interviewScore, setInterviewScore] = React.useState(0);

  // Clears old saved data and shows 0 everywhere
  const resetCareerData = () => {
    CAREER_KEYS.forEach((key) => localStorage.removeItem(key));
    setHasResume(false);
    setResumeScore(0);
    setAtsScore(0);
    setJobMatchScore(0);
    setSkillScore(0);
    setSkillCount(0);
    setInterviewScore(0);
  };

  // Logged-in user's name
  React.useEffect(() => {
    // 1. Show the saved user name immediately (saved at login)
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored?.name) setUserName(stored.name);
    } catch {
      // ignore invalid saved data
    }

    // 2. Load the latest name from the backend
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadUser = async () => {
      try {
        const response = await fetch("https://career-ai-z87n.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        const profile = data?.user || data;
        const name = profile?.name;

        // The server saves skills only after a resume is analyzed.
        // No skills on this account means no resume yet, so any
        // data in this browser belongs to an old test or another user.
        if (response.ok && !profile?.skills) {
          resetCareerData();
        }

        if (response.ok && name) {
          setUserName(name);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...(data.user || data), name })
          );
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  // Scores saved by the other pages
  React.useEffect(() => {
    const savedAnalysis =
      localStorage.getItem("careerAI_resume_analysis") ||
      localStorage.getItem("resumeAnalysis");
    const savedSkillScore = localStorage.getItem("careerAI_skillScore");
    const savedSkillCount = localStorage.getItem("careerAI_skillCount");
    const savedInterviewScore = localStorage.getItem(
      "careerAI_interviewScore"
    );
    const savedJobMatchScore = localStorage.getItem(
      "careerAI_jobMatchScore"
    );

    if (savedSkillScore !== null) {
      setSkillScore(Number(savedSkillScore) || 0);
    }

    if (savedSkillCount !== null) {
      setSkillCount(Number(savedSkillCount) || 0);
    }

    if (savedInterviewScore !== null) {
      setInterviewScore(Number(savedInterviewScore) || 0);
    }

    if (savedJobMatchScore !== null) {
      setJobMatchScore(Number(savedJobMatchScore) || 0);
    }

    if (savedAnalysis) {
      try {
        const result = JSON.parse(savedAnalysis);
        const analysis = result.analysis || result;

        setResumeScore(Number(analysis.resumeScore) || 0);
        setAtsScore(Number(analysis.atsScore) || 0);
        setHasResume(true);
      } catch (error) {
        console.error("Unable to load resume analysis:", error);
      }
    }
  }, []);

  const firstName = userName ? userName.trim().split(" ")[0] : "there";

  // Projects score is 0 until a resume is analyzed
  const projectsScore = hasResume ? 70 : 0;

  const currentCareerScore = Math.round(
    (resumeScore + skillScore + interviewScore + projectsScore) / 4
  );

  const hasAnyData = currentCareerScore > 0;

  const performanceData = [{ month: "Current", score: currentCareerScore }];

  const readinessData = [
    {
      name: "Resume",
      score: resumeScore,
      color: "from-purple-500 to-blue-500",
    },
    {
      name: "Skills",
      score: skillScore,
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Interview",
      score: interviewScore,
      color: "from-emerald-400 to-green-400",
    },
    {
      name: "Projects",
      score: projectsScore,
      color: "from-orange-400 to-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090014] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Navbar */}
          <Navbar />

          <div className="px-7 py-7">
            {/* Welcome */}
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.22em] text-purple-400">
                  CAREERAI DASHBOARD
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Welcome back, {firstName}! 👋
                </h1>

                <p className="mt-2 text-sm text-white/45">
                  Track your career growth, improve your resume,
                  and get placement-ready with AI.
                </p>
              </div>

              <button className="hidden items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-3 text-sm font-medium text-purple-300 transition hover:bg-purple-500/20 lg:flex">
                <Sparkles size={16} />
                AI Career Insights
                <ArrowUpRight size={15} />
              </button>
            </div>

            {/* Stat Cards */}
            <section className="grid grid-cols-4 gap-4">
              <StatCard
                title="Resume Score"
                value={`${resumeScore}%`}
                change={hasResume ? "AI Analyzed" : "Upload resume"}
                icon={FileText}
              />

              <StatCard
                title="ATS Score"
                value={`${atsScore}%`}
                change={hasResume ? "AI Analyzed" : "Upload resume"}
                icon={Gauge}
              />

              <StatCard
                title="Job Match"
                value={`${jobMatchScore}%`}
                change={jobMatchScore > 0 ? "AI Matched" : "Not analyzed yet"}
                icon={Target}
              />

              <StatCard
                title="Skills"
                value={skillCount}
                change={`${skillScore}% score`}
                icon={Sparkles}
              />
            </section>

            {/* Analytics */}
            <div className="mt-5 grid grid-cols-[1.55fr_1fr] gap-5">
              {/* Career Performance */}
              <div className="rounded-2xl border border-purple-500/30 bg-[#10081b] p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Career Performance
                    </h2>

                    <p className="mt-2 text-sm text-white/40">
                      Your career readiness progress
                    </p>
                  </div>

                  {hasAnyData && (
                    <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-3">
                      <TrendingUp size={16} className="text-purple-400" />

                      <span className="text-sm font-semibold text-purple-300">
                        {currentCareerScore}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-7 flex items-end gap-3">
                  <span className="text-4xl font-bold">
                    {currentCareerScore}%
                  </span>

                  <span className="mb-1 text-sm text-emerald-400">
                    Career Score
                  </span>
                </div>

                {/* Chart */}
                <div className="mt-7">
                  <div className="relative h-64">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="border-t border-white/5" />
                      <div className="border-t border-white/5" />
                      <div className="border-t border-white/5" />
                      <div className="border-t border-white/5" />
                      <div className="border-t border-white/5" />
                    </div>

                    <div className="absolute inset-0 flex items-end justify-between px-5">
                      {performanceData.map((item) => (
                        <div
                          key={item.month}
                          className="flex h-full w-12 items-end justify-center"
                        >
                          <div
                            className="w-10 rounded-t-xl bg-gradient-to-t from-purple-700 via-purple-500 to-blue-400 transition-all duration-300 hover:from-purple-600 hover:to-blue-300"
                            style={{
                              height: `${item.score}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between px-5">
                    {performanceData.map((item) => (
                      <span
                        key={item.month}
                        className="w-12 text-center text-sm text-white/35"
                      >
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Scores */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-sm text-white/35">Starting Score</p>

                    <p className="mt-2 text-lg font-semibold">
                      {currentCareerScore}%
                    </p>
                  </div>

                  <div className="h-9 w-px bg-white/10" />

                  <div className="text-right">
                    <p className="text-sm text-white/35">Current Score</p>

                    <p className="mt-2 text-lg font-semibold text-purple-300">
                      {currentCareerScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Placement Readiness */}
              <div className="rounded-2xl border border-white/10 bg-[#10081b] p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Placement Readiness
                    </h2>

                    <p className="mt-2 text-sm text-white/40">
                      Your overall preparation level
                    </p>
                  </div>

                  <MoreHorizontal size={22} className="text-white/40" />
                </div>

                {/* Circle */}
                <div className="mt-7 flex justify-center">
                  <div
                    className="relative flex h-40 w-40 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#a855f7 0deg ${
                        currentCareerScore * 3.6
                      }deg, #241832 ${currentCareerScore * 3.6}deg 360deg)`,
                    }}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#10081b]">
                      <span className="text-4xl font-bold">
                        {currentCareerScore}%
                      </span>

                      <span className="mt-1 text-sm text-white/45">
                        Overall Readiness
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-7 space-y-4">
                  {readinessData.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">
                          {item.name}
                        </span>

                        <span className="text-sm font-semibold">
                          {item.score}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{
                            width: `${item.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
                  <h3 className="font-semibold">
                    {!hasResume
                      ? "Let's get started! 🚀"
                      : currentCareerScore >= 75
                      ? "You're almost placement-ready! 🚀"
                      : "You're making progress! 🚀"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {!hasResume
                      ? "Upload your resume in the Resume Analyzer to see your scores and get a personalized career roadmap."
                      : "Improve your interview skills and add one more project to increase your readiness score."}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Career Tools */}
            <AICareerTools />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/job-matcher" element={<JobMatcher />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="/skill-analyzer" element={<SkillAnalyzer />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;