import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function SkillAnalyzer() {
  const [targetRole, setTargetRole] = useState("Full Stack Developer");

  const skills = [
    {
      name: "JavaScript",
      level: "Advanced",
      score: 88,
      status: "Strong",
    },
    {
      name: "React.js",
      level: "Intermediate",
      score: 76,
      status: "Good",
    },
    {
      name: "Node.js",
      level: "Intermediate",
      score: 72,
      status: "Good",
    },
    {
      name: "MongoDB",
      level: "Intermediate",
      score: 68,
      status: "Needs Improvement",
    },
    {
      name: "SQL",
      level: "Beginner",
      score: 54,
      status: "Needs Improvement",
    },
    {
      name: "Git & GitHub",
      level: "Intermediate",
      score: 74,
      status: "Good",
    },
  ];

  const strengths = ["JavaScript", "React.js", "Git & GitHub"];

  const improvements = ["SQL", "MongoDB", "Node.js"];

  return (
    <div className="flex min-h-screen bg-[#090014] text-white">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                  AI Career Intelligence
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  Skill Analyzer
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                  Analyze your technical skills and identify the areas you
                  should improve for your target career.
                </p>
              </div>

              <div className="w-full md:w-64">
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Target Role
                </label>

                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500/50"
                >
                  <option className="bg-[#12001d]" value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option className="bg-[#12001d]" value="Frontend Developer">
                    Frontend Developer
                  </option>
                  <option className="bg-[#12001d]" value="Backend Developer">
                    Backend Developer
                  </option>
                  <option className="bg-[#12001d]" value="Software Developer">
                    Software Developer
                  </option>
                </select>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <ShieldCheck size={21} />
                  </div>

                  <TrendingUp size={18} className="text-emerald-400" />
                </div>

                <p className="mt-5 text-sm text-white/45">Overall Skill Score</p>

                <div className="mt-1 flex items-end gap-2">
                  <h2 className="text-4xl font-bold">74%</h2>
                  <span className="mb-1 text-xs text-emerald-400">
                    Good
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={21} />
                </div>

                <p className="mt-5 text-sm text-white/45">Strong Skills</p>
                <h2 className="mt-1 text-4xl font-bold">3</h2>
                <p className="mt-2 text-xs text-white/35">
                  Skills above recommended level
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <AlertCircle size={21} />
                </div>

                <p className="mt-5 text-sm text-white/45">
                  Skills to Improve
                </p>
                <h2 className="mt-1 text-4xl font-bold">3</h2>
                <p className="mt-2 text-xs text-white/35">
                  Skills that need more practice
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              {/* Skills */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Technical Skill Analysis
                    </h2>
                    <p className="mt-1 text-xs text-white/35">
                      Your current skill level for {targetRole}
                    </p>
                  </div>

                  <ShieldCheck size={20} className="text-purple-400" />
                </div>

                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{skill.name}</p>
                          <p className="mt-1 text-xs text-white/35">
                            {skill.level}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {skill.score}%
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              skill.score >= 80
                                ? "text-emerald-400"
                                : skill.score >= 65
                                ? "text-purple-400"
                                : "text-orange-400"
                            }`}
                          >
                            {skill.status}
                          </p>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* AI Insights */}
              <section className="space-y-6">
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-blue-900/10 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold">AI Skill Insights</h2>
                      <p className="text-xs text-white/35">
                        Personalized recommendations
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-white/55">
                    Your strongest area is JavaScript and frontend
                    development. To become more placement-ready for a{" "}
                    {targetRole} role, focus on backend development, databases,
                    and real-world project experience.
                  </p>

                  <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-semibold transition hover:from-purple-500 hover:to-blue-500">
                    Generate Learning Plan
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-lg font-semibold">Your Strengths</h2>

                  <div className="mt-5 space-y-3">
                    {strengths.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3"
                      >
                        <CheckCircle2
                          size={17}
                          className="text-emerald-400"
                        />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-lg font-semibold">Focus Areas</h2>

                  <div className="mt-5 space-y-3">
                    {improvements.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3 rounded-xl border border-orange-500/10 bg-orange-500/5 px-4 py-3"
                      >
                        <AlertCircle
                          size={17}
                          className="text-orange-400"
                        />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SkillAnalyzer;