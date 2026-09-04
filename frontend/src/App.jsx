import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";

import {
  FileText,
  Gauge,
  Target,
  Sparkles,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#090014] text-white">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <main className="flex-1">

          {/* Navbar */}
          <Navbar />

          {/* Dashboard Content */}
          <div className="p-8">

            {/* Welcome Section */}
            <div className="mb-8">
              <p className="text-sm font-medium text-purple-400">
                CAREERAI DASHBOARD
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Welcome back 👋
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Here's an overview of your career progress.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;