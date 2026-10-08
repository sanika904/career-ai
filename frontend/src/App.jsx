import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import AICareerTools from "./components/AICareerTools";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import SkillAnalyzer from "./pages/SkillAnalyzer";
import {
  FileText,
  Gauge,
  Target,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const performanceData = [
    { month: "Jan", score: 52 },
    { month: "Feb", score: 58 },
    { month: "Mar", score: 61 },
    { month: "Apr", score: 68 },
    { month: "May", score: 74 },
    { month: "Jun", score: 82 },
  ];

  const readinessData = [
    {
      name: "Resume",
      score: 82,
      color: "from-purple-500 to-blue-500",
    },
    {
      name: "Skills",
      score: 76,
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Interview",
      score: 68,
      color: "from-emerald-400 to-green-400",
    },
    {
      name: "Projects",
      score: 70,
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
                  Welcome back, Sanika! 👋
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
                value="82%"
                change="+8.4%"
                icon={FileText}
              />

              <StatCard
                title="ATS Score"
                value="88%"
                change="+5.2%"
                icon={Gauge}
              />

              <StatCard
                title="Job Match"
                value="76%"
                change="+12.5%"
                icon={Target}
              />

              <StatCard
                title="Skills"
                value="12"
                change="+3 new"
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

                  <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-3">
                    <TrendingUp
                      size={16}
                      className="text-purple-400"
                    />

                    <span className="text-sm font-semibold text-purple-300">
                      +30%
                    </span>
                  </div>

                </div>

                <div className="mt-7 flex items-end gap-3">
                  <span className="text-4xl font-bold">
                    82%
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
                    <p className="text-sm text-white/35">
                      Starting Score
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      52%
                    </p>
                  </div>

                  <div className="h-9 w-px bg-white/10" />

                  <div className="text-right">
                    <p className="text-sm text-white/35">
                      Current Score
                    </p>

                    <p className="mt-2 text-lg font-semibold text-purple-300">
                      82%
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

                  <MoreHorizontal
                    size={22}
                    className="text-white/40"
                  />

                </div>

                {/* Circle */}
                <div className="mt-7 flex justify-center">

                  <div
                    className="relative flex h-40 w-40 items-center justify-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(#a855f7 0deg 280deg, #241832 280deg 360deg)",
                    }}
                  >

                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#10081b]">

                      <span className="text-4xl font-bold">
                        78%
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
                    You're almost placement-ready! 🚀
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Improve your interview skills and add one more
                    project to increase your readiness score.
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
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Resume Analyzer */}
        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        <Route
          path="/job-matcher"
          element={<JobMatcher />}
        />

        <Route
          path="/mock-interview"
          element={<MockInterview />}
        />

        <Route
          path="/career-roadmap"
          element={<CareerRoadmap />}
        />

        <Route
          path="/skill-analyzer"
          element={<SkillAnalyzer />}
        />

        {/*<Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;