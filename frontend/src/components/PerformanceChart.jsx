import { TrendingUp } from "lucide-react";

function PerformanceChart() {
  const performanceData = [
    { month: "Jan", score: 52 },
    { month: "Feb", score: 58 },
    { month: "Mar", score: 61 },
    { month: "Apr", score: 68 },
    { month: "May", score: 74 },
    { month: "Jun", score: 82 },
  ];

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-white/[0.03] p-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Career Performance
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Your career readiness progress
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2">
          <TrendingUp
            size={15}
            className="text-purple-400"
          />

          <span className="text-xs font-medium text-purple-300">
            +30%
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-bold">
          82%
        </span>

        <span className="mb-1 text-sm text-emerald-400">
          Career Score
        </span>
      </div>

      {/* Chart */}
      <div className="mt-7">

        {/* Chart Area */}
        <div className="relative h-64">

          {/* Horizontal Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">

            <div className="border-t border-white/5" />
            <div className="border-t border-white/5" />
            <div className="border-t border-white/5" />
            <div className="border-t border-white/5" />
            <div className="border-t border-white/5" />

          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-5">

            {performanceData.map((item) => (
              <div
                key={item.month}
                className="flex h-full w-12 flex-col items-center justify-end"
              >
                <div
                  className="w-10 rounded-t-xl bg-gradient-to-t from-purple-700 via-purple-500 to-blue-400 transition-all duration-300 hover:from-purple-600 hover:to-blue-300"
                  style={{
                    height: `${item.score}%`,
                  }}
                />
              </div>
            ))}

          </div>
        </div>

        {/* Months */}
        <div className="mt-3 flex justify-between px-5">
          {performanceData.map((item) => (
            <span
              key={item.month}
              className="w-12 text-center text-sm text-white/35"
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

        {/* Starting Score */}
        <div>
          <p className="text-sm text-white/35">
            Starting Score
          </p>

          <p className="mt-2 text-base font-semibold">
            52%
          </p>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10" />

        {/* Current Score */}
        <div className="text-right">
          <p className="text-sm text-white/35">
            Current Score
          </p>

          <p className="mt-2 text-base font-semibold text-purple-300">
            82%
          </p>
        </div>

      </div>

    </div>
  );
}

export default PerformanceChart;