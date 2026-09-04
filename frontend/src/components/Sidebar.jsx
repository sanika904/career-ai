import {
    LayoutDashboard,
    Sparkles,
    FileText,
    Target,
    Video,
    Map,
    MessageCircle,
    Settings,
} from "lucide-react";

function Sidebar() {
    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, active: true },
        { name: "AI Resume" , icon: Sparkles, },
        { name: "My Resume", icon: FileText, },
        { name: "Job Matcher", icon: Target, },
        { name: "Mock Interview", icon: Video, },
        { name: "Career Roadmap", icon: Map, },
        { name: "Career AI", icon: MessageCircle, }
    ];

    return ( 
        <aside className="w-64 min-h-screen boarder-r border-white/10 bg-[#0d0018] p-5 text-white">

            <div className="flex items-center gap-3 px-2 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                 <Sparkles size={20} />
                </div>

                <div>
                   <h1 className="text-xl font-bold">CareerAI</h1>
                    <p className="text-xs text-white/40">
                      Career Intelligence
                    </p>
                </div> 
            </div>

                  <nav className="mt-10 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                item.active
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/55 transition hover:bg-white/5 hover:text-white">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;