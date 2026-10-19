
import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const userName = user?.name || "Guest";

  const userInitials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#090014] px-5 sm:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-5">
        <button
          className="text-white/70 transition hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex w-40 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:w-64 md:w-[460px]">
          <Search size={19} className="shrink-0 text-white/40" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = e.currentTarget.value.trim() .toLowerCase();
                  const pages = [
                    { name: "dashboard", path: "/" },
                    { name: "resume", path: "/resume-analyzer" },
                    { name: "resume analyzer", path: "/resume-analyzer" },
                    { name: "job matcher", path: "/job-matcher" },
                    { name: "jobs", path: "/job-matcher" },
                    { name: "mock interview", path: "/mock-interview" },
                    { name: "interview", path: "/mock-interview" },
                    { name: "career roadmap", path: "/career-roadmap" },
                    { name: "roadmap", path: "/career-roadmap" },
                    { name: "skill analyzer", path: "/skill-analyzer" },
                    { name: "skills", path: "/skill-analyzer" },
                    { name: "applications", path: "/applications" },
                    { name: "profile", path: "/profile" },
                    { name: "settings", path: "/settings" },
                    { name: "login", path: "/login" },
                    { name: "signup", path: "/signup" },
                    { name: "ai resume", path: "/resume-analyzer" },
                    { name: "resume analysis", path: "/resume-analyzer" },
                    { name: "resume analyzer", path: "/resume-analyzer" },
                    { name: "ai resume analyzer", path: "/resume-analyzer" },
                  ];

                const matchedPage = pages.find(
                (page) => page.name === query
               );

              if (matchedPage) {
             navigate(matchedPage.path);
             e.currentTarget.value = "";
            } else {
          alert("Page not found. Please try another page name.");
        }
      }
    }}
  />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <>
            <button
              className="relative rounded-xl border border-white/10 p-3 text-white/60 transition hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-2 py-2 transition hover:bg-white/5 sm:gap-3 sm:px-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-sm font-semibold text-white">
                  {userInitials}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-white/40">Student</p>
                </div>

                <ChevronDown size={16} className="text-white/40" />
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-purple-500/30 px-3 py-2 text-sm font-medium text-purple-300 transition hover:bg-purple-500/10"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
