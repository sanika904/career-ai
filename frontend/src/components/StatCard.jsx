import { TrendingUp } from "lucide-react";

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.05]">
      
      {/* Top */}
      <div className="flex items-start justify-between">

        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={20} />
        </div>

        {/* Growth */}
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
          <TrendingUp size={13} />
          {change}
        </span>
      </div>

      {/* Title */}
      <p className="mt-5 text-sm text-white/45">
        {title}
      </p>

      {/* Value */}
      <h3 className="mt-1 text-3xl font-bold">
        {value}
      </h3>

    </div>
  );
}

export default StatCard;