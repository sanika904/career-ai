import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Map,
  Sparkles,
  Target,
  Code2,
  FolderGit2,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Circle,
  RefreshCw,
  FileText,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const STORAGE_KEY = "careerAI_roadmap_progress";
const ANALYSIS_KEY = "careerAI_resume_analysis";
const STEP_ICONS = [Code2, Target, FolderGit2, MessageSquare, Briefcase];

function readStoredResumeData() {
  try {
    const raw = localStorage.getItem(ANALYSIS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getSkills(data) {
  const list = data?.extractedSkills;
  if (!Array.isArray(list)) return [];
  return list
    .map((s) => (typeof s === "string" ? s : s?.name || ""))
    .filter(Boolean);
}

function getRoadmap(data) {
  if (!Array.isArray(data?.roadmap)) return [];
  return data.roadmap.map((step, index) => ({
    id: `step-${index + 1}`,
    step: String(index + 1).padStart(2, "0"),
    title: step.title || `Step ${index + 1}`,
    description: step.description || "",
    status: step.status || "Learning",
    icon: STEP_ICONS[index % STEP_ICONS.length],
  }));
}

function CareerRoadmap() {
  const [resumeData, setResumeData] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setResumeData(readStoredResumeData());

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setCompleted(saved);
    } catch {
      setCompleted([]);
    }
  }, []);

  const skills = useMemo(() => getSkills(resumeData), [resumeData]);
  const roadmap = useMemo(() => getRoadmap(resumeData), [resumeData]);
  const career = resumeData?.suggestedCareerGoal || "";

  const toggleStep = (id) => {
    setCompleted((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    setCompleted([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowReset(false);
  };

  const doneCount = roadmap.filter((i) => completed.includes(i.id)).length;
  const progress = roadmap.length
    ? Math.round((doneCount / roadmap.length) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-[#090014] text-white">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="px-5 py-7 sm:px-8">
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Sparkles size={20} />
              <span className="text-sm font-medium">AI Career Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Career Roadmap</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              A learning plan generated from your resume skills and best-fit role.
            </p>
          </div>

          {!resumeData || roadmap.length === 0 ? (
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <FileText size={24} />
              </div>
              <h2 className="text-lg font-semibold">No roadmap yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
                Upload and analyze your resume to get a personalized career
                roadmap.
              </p>
              <Link
                to="/resume-analyzer"
                className="mt-5 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-semibold"
              >
                Analyze Resume
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Map size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-purple-400">
                      Target Career (from your resume)
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {career || "Not detected"}
                    </h2>

                    {skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-purple-400">
                      Learning Progress
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {doneCount} of {roadmap.length} steps completed
                    </h2>
                  </div>
                  <span className="text-xl font-bold text-purple-300">
                    {progress}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </section>

              <section className="mt-7">
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                    Your Journey
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Step-by-Step Roadmap
                  </h2>
                </div>

                <div className="space-y-4">
                  {roadmap.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      isCompleted={completed.includes(item.id)}
                      onToggle={() => toggleStep(item.id)}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setShowReset(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
                >
                  <RefreshCw size={15} />
                  Reset Progress
                </button>

                {showReset && (
                  <div className="mt-3 rounded-xl border border-white/10 p-4">
                    <p className="text-sm">Reset all completed roadmap steps?</p>
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={resetProgress}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm"
                      >
                        Yes, reset
                      </button>
                      <button
                        onClick={() => setShowReset(false)}
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function RoadmapCard({ item, isCompleted, onToggle }) {
  const Icon = item.icon;

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        isCompleted
          ? "border-emerald-500/25 bg-emerald-500/[0.04]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4 md:w-52">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-purple-500/10 text-purple-400"
            }`}
          >
            <Icon size={21} />
          </div>

          <div>
            <p className="text-xs text-white/35">STEP {item.step}</p>
            <span className="text-xs font-medium text-white/50">
              {isCompleted ? "Completed" : item.status}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/50">
            {item.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
            isCompleted
              ? "border-emerald-500/20 text-emerald-300"
              : "border-white/10 text-white/60 hover:border-purple-500/30"
          }`}
        >
          {isCompleted ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          {isCompleted ? "Completed" : "Mark Complete"}
        </button>
      </div>
    </div>
  );
}

export default CareerRoadmap;