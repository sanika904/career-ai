import {
  Search,
  Target,
  MapPin,
  Briefcase,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function JobMatcher() {
  const jobs = [
    {
      title: "Frontend Developer",
      company: "Tech Solutions",
      location: "Pune, India",
      type: "Full Time",
      match: 92,
      skills: ["React.js", "JavaScript", "Tailwind CSS"],
    },
    {
      title: "Full Stack Developer",
      company: "Innovate Labs",
      location: "Mumbai, India",
      type: "Full Time",
      match: 87,
      skills: ["React.js", "Node.js", "MongoDB"],
    },
    {
      title: "Junior Software Developer",
      company: "CodeSphere",
      location: "Remote",
      type: "Remote",
      match: 81,
      skills: ["JavaScript", "Node.js", "SQL"],
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
              Smart Job Matcher
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Discover job opportunities that match your skills,
              experience, and career goals.
            </p>
          </div>

          {/* Search */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <Search
                  size={19}
                  className="text-white/35"
                />

                <input
                  type="text"
                  placeholder="Search job title or skill..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold transition hover:from-purple-500 hover:to-blue-500">
                <Search size={18} />
                Find Jobs
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MatcherStat
              icon={Target}
              title="Best Match"
              value="92%"
            />

            <MatcherStat
              icon={Briefcase}
              title="Jobs Found"
              value="24"
            />

            <MatcherStat
              icon={Sparkles}
              title="Skills Matched"
              value="8"
            />
          </div>

          {/* Recommended Jobs */}
          <div className="mt-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recommended Jobs
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Jobs selected based on your profile
                </p>
              </div>

              <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
                AI Matched
              </span>
            </div>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Stats */

function MatcherStat({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/30">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={19} />
        </div>

        <Sparkles
          size={16}
          className="text-purple-400/50"
        />
      </div>

      <p className="mt-5 text-sm text-white/40">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-bold">
        {value}
      </h3>
    </div>
  );
}

/* Job Card */

function JobCard({ job }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.05]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Job Info */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 text-purple-400">
            <Briefcase size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {job.title}
            </h3>

            <p className="mt-1 text-sm text-white/50">
              {job.company}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {job.location}
              </span>

              <span className="flex items-center gap-1.5">
                <Briefcase size={14} />
                {job.type}
              </span>
            </div>
          </div>
        </div>

        {/* Match */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs text-white/35">
              AI Match
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {job.match}%
            </p>
          </div>

          <button className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-purple-300 transition hover:bg-purple-500/20 hover:text-white">
            View Job
          </button>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-5 border-t border-white/5 pt-4">
        <p className="mb-2 text-xs text-white/35">
          Matching Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobMatcher;