import {
  FileText,
  Target,
  Video,
  Map,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AICareerTools() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "AI Resume Analyzer",
      description:
        "Analyze your resume and get AI-powered suggestions to improve your score.",
      icon: FileText,
      label: "Analyze Resume",
      action: () => navigate("/resume-analyzer"),
    },
    {
      title: "Smart Job Matcher",
      description:
        "Find jobs that match your skills, experience, and career goals.",
      icon: Target,
      label: "Find Jobs",
      action: () => navigate("/job-matcher"),
    },
    {
      title: "AI Mock Interview",
      description:
        "Practice real interview questions and get instant AI feedback.",
      icon: Video,
      label: "Start Interview",
      action: () => navigate("/mock-interview"),
    },
    {
      title: "Career Roadmap",
      description:
        "Get a personalized roadmap to reach your target career.",
      icon: Map,
      label: "View Roadmap",
      action: () => navigate("/career-roadmap"),
    },
    {
      title: "Skill Analyzer",
      description:
        "Analyze your technical skills and discover areas that need improvement.",
      icon: ShieldCheck,
      label: "Analyze Skills",
      action: () => navigate("/skill-analyzer"),
    },
  ];

  return (
    <section className="mt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
            AI Career Intelligence
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            AI Career Tools
          </h2>
        </div>

        <Sparkles size={20} className="text-purple-400" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <div
              key={tool.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Icon size={22} />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {tool.title}
              </h3>

              <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/45">
                {tool.description}
              </p>

              <button
                onClick={tool.action}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-white transition hover:text-purple-300"
              >
                {tool.label}
                <ArrowUpRight size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AICareerTools;