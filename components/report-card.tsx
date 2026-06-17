import { RadarChart } from "@/components/radar-chart";
import type { CityReport } from "@/lib/mock-report";

export function ReportCard({
  report,
  onRestart,
}: {
  report: CityReport;
  onRestart: () => void;
}) {
  return (
    <div className="rounded-[32px] bg-white/85 p-6 shadow-sm ring-1 ring-black/5">
      <p className="mb-2 text-sm font-medium text-[#d97745]">
        你的本命城市是
      </p>

      <div className="mb-5 flex items-end justify-between gap-4">
        <h1 className="text-4xl font-black">{report.city}</h1>
        <div className="text-right">
          <p className="text-xs text-[#8a7463]">匹配度</p>
          <p className="text-3xl font-black text-[#d97745]">
            {report.matchScore}%
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {report.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#fff3e2] px-3 py-1 text-xs font-medium text-[#b75f32]"
          >
            #{tag}
          </span>
        ))}
      </div>

      <RadarChart
        userProfile={report.userProfile}
        cityProfile={report.cityProfile}
      />

      <div className="mt-5 rounded-3xl bg-[#f6f1e8] p-4">
        <p className="mb-2 text-sm font-semibold text-[#2f2a24]">
          AI 犀利点评
        </p>
        <p className="text-sm leading-7 text-[#6f5f51]">{report.reason}</p>
      </div>

      <p className="mt-5 text-center text-xs text-[#9b8572]">
        截图分享给朋友，看看谁最适合和你住一座城。
      </p>

      <button
        onClick={onRestart}
        className="mt-5 w-full rounded-2xl border border-[#eadfce] bg-[#fffaf2] px-5 py-4 text-sm font-medium text-[#7d6a5a]"
      >
        重新测试
      </button>
    </div>
  );
}
