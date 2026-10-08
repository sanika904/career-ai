import {
  Bell,
  ChevronDown,
  Search,
  Menu,
} from "lucide-react";

function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#090014] px-5 sm:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-5">

        {/* Menu */}
        <button
          className="text-white/70 transition hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="flex w-64 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition focus-within:border-purple-500/40 sm:w-80 md:w-[460px]">

          <Search
            size={19}
            className="shrink-0 text-white/40"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          className="relative rounded-xl border border-white/10 p-3 text-white/60 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 transition hover:bg-white/5">

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-sm font-semibold">
            SP
          </div>

          {/* User Info */}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-white">
              Sanika Patil
            </p>

            <p className="text-xs text-white/40">
              Student
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-white/40"
          />

        </button>

      </div>

    </header>
  );
}

export default Navbar;