import {
  Bell,
  ChevronDown,
  Search,
  UserRound,
} from "lucide-react";

function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#090014] px-5 sm:px-8">
      
      {/* Search */}
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <Search size={18} className="text-white/40" />

        <input
          type="text"
          placeholder="Search CareerAI..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>

      {/* Right Section */}
      <div className="ml-4 flex items-center gap-3">

        {/* Notification */}
        <button
          className="relative rounded-xl border border-white/10 p-2.5 transition hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell size={19} className="text-white/70" />

          {/* Notification dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
        </button>

        {/* Profile */}
        <button className="hidden items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition hover:bg-white/5 sm:flex">
          
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <UserRound size={17} />
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-white">
              Your Name
            </p>

            <p className="text-xs text-white/40">
              Student
            </p>
          </div>

          <ChevronDown
            size={15}
            className="text-white/40"
          />
        </button>
      </div>
    </header>
  );
}

export default Navbar;