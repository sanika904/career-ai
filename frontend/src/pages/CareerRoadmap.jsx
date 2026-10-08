import { useState } from "react";
import {
  Map,
  Sparkles,
  Target,
  Code2,
  FolderGit2,
  MessageSquare,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function CareerRoadmap() {
  const [career, setCareer] = useState("Full Stack Developer");

  const roadmap = [
    {
      step: "01",
      title: "Master Core Technologies",
      description:
        "Strengthen JavaScript, HTML, CSS, React.js, Node.js, and database fundamentals.",
      icon: Code2,
      status: "Current Focus",
    },
    {
      step: "02",
      title: "Build Real-World Projects",
      description:
        "Create practical full-stack projects that demonstrate your development skills.",
      icon: FolderGit2,
      status: "Next Step",
    },
    {
      step: "03",
      title: "Prepare for Interviews",
      description:
        "Practice technical questions, HR questions, and mock interviews.",
      icon: MessageSquare,
      status: "Upcoming",
    },
    {
      step: "04",
      title: "Become Placement Ready",
      description:
        "Improve your resume, apply to relevant jobs, and track your applications.",
      icon: Briefcase,
      status: "Goal",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#090014] text-white">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="px-5 py-7 sm:px-8">
          {/* Header */}
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Sparkles size={20} />

              <span className="text-sm font-medium">
                AI Career Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Career Roadmap
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Follow a personalized step-by-step path to reach your
              target career.
            </p>
          </div>

          {/* Career Selection */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Target size={20} />
                </div>

                <h2 className="text-lg font-semibold">
                  Choose Your Career Goal
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Select the role you want to prepare for.
                </p>
              </div>

              <div className="w-full lg:w-80">
                <select
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500/40"
                >
                  <option className="bg-[#12051c]">
                    Full Stack Developer
                  </option>

                  <option className="bg-[#12051c]">
                    Frontend Developer
                  </option>

                  <option className="bg-[#12051c]">
                    Backend Developer
                  </option>

                  <option className="bg-[#12051c]">
                    Software Developer
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Goal Card */}
          <div className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Map size={21} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-purple-400">
                  Your Target
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {career}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Your roadmap is designed to help you build the
                  skills, projects, and interview confidence needed
                  for this career.
                </p>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="mt-7">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                Your Journey
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Step-by-Step Roadmap
              </h2>
            </div>

            <div className="space-y-4">
              {roadmap.map((item, index) => (
                <RoadmapCard
                  key={index}
                  item={item}
                  isCurrent={index === 0}
                />
              ))}
            </div>
          </div>

          {/* AI Tip */}
          <div className="mt-6 rounded-2xl border border-purple-500/20 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-purple-400">
                  AI Career Tip
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Focus on consistency
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Build one strong project at a time and keep improving
                  your technical skills through practical development.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Roadmap Card */

function RoadmapCard({ item, isCurrent }) {
  const Icon = item.icon;

  return (
    <div
      className={`rounded-2xl border p-5 transition duration-300 ${
        isCurrent
          ? "border-purple-500/30 bg-purple-500/[0.05]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* Step */}
        <div className="flex items-center gap-4 md:w-52">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isCurrent
                ? "bg-purple-500/15 text-purple-400"
                : "bg-white/5 text-white/40"
            }`}
          >
            <Icon size={21} />
          </div>

          <div>
            <p className="text-xs text-white/35">
              STEP {item.step}
            </p>

            <span
              className={`text-xs font-medium ${
                isCurrent
                  ? "text-purple-400"
                  : "text-white/35"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {item.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {item.description}
          </p>
        </div>

        {/* Status */}
        <div>
          {isCurrent ? (
            <span className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
              <Sparkles size={14} />
              In Progress
            </span>
          ) : (
            <CheckCircle2
              size={20}
              className="text-white/20"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerRoadmap;