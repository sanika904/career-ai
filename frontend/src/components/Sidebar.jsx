import {
  LayoutDashboard,
  Sparkles,
  Target,
  Video,
  Map,
  ShieldCheck,
  Briefcase,
  UserRound,
  Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "AI Resume",
      icon: Sparkles,
      path: "/resume-analyzer",
    },
    {
      name: "Job Matcher",
      icon: Target,
      path: "/job-matcher",
    },
    {
      name: "Mock Interview",
      icon: Video,
      path: "/mock-interview",
    },
    {
      name: "Career Roadmap",
      icon: Map,
      path: "/career-roadmap",
    },
    {
      name: "Skill Analyzer",
      icon: ShieldCheck,
      path: "/skill-analyzer",
    },
    {
      name: "Applications",
      icon: Briefcase,
      //path: "/applications",
    },
    {
      name: "Profile",
      icon: UserRound,
     // path: "/profile",
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-[#08000f] p-4 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
          <Sparkles size={21} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            CareerAI
          </h1>

          <p className="text-xs text-white/40">
            Career Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-4">
        {/* Upgrade Card */}
        <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-900/40 to-blue-900/20 p-4 shadow-lg shadow-purple-900/10">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20">
            <Sparkles
              size={18}
              className="text-purple-300"
            />
          </div>

          <h3 className="text-sm font-semibold">
            Upgrade to Pro
          </h3>

          <p className="mt-2 text-xs leading-5 text-white/45">
            Unlock advanced AI features and insights.
          </p>

          <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-2.5 text-xs font-semibold transition hover:from-purple-500 hover:to-blue-500">
            Upgrade Now
          </button>
        </div>

        {/* Settings */}
        <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
          <Settings size={19} />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;