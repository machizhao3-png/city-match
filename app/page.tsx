"use client";

import { useState } from "react";
import type { CityReport, Profile } from "@/lib/mock-report";

const questions = [
  {
    title: "如果可以瞬间移动，你最想先去哪儿？",
    options: [
      "凌晨三点的街边烧烤摊",
      "雪山之巅看日出",
      "海岛沙滩躺平",
      "古镇小巷里迷路",
      "哪儿都不去，躺在床上刷手机挺好的",
    ],
  },
  {
    title: "你的钱包失忆了，里面只剩三位数，你会？",
    options: [
      "打个车去吃顿好的",
      "买张彩票赌一把",
      "买点食材给自己做顿饭",
      "存起来等着它自己想起来",
      "宅家熬两周",
    ],
  },
  {
    title: "你的手机只能留一个 App，你会选？",
    options: [
      "微信（人脉即一切）",
      "地图（世界需要被看见）",
      "音乐（灵魂需要BGM）",
      "外卖（懒是第一天性）",
      "短视频 App（不出门也能快乐）",
    ],
  },
  {
    title: "朋友描述你，用得最多的词是？",
    options: ["会玩", "靠谱", "惊喜", "闷骚", "社恐"],
  },
  {
    title: "你理想的周末是这样的？",
    options: [
      "五湖四海朋友聚会，热闹到半夜",
      "一个人泡咖啡馆发呆看书",
      "爬山/骑行/户外，动到虚脱",
      "逛展/看剧/听讲座，文艺到骨子里",
      "在家点上外卖、追剧到天亮",
    ],
  },
  {
    title: "如果城市是一个人，你觉得你俩的关系是？",
    options: [
      "一起搞钱的战友",
      "彼此初恋般的甜蜜",
      "相敬如宾的老伙计",
      "三天一小吵五天一大吵但谁也离不开谁",
      "不熟",
    ],
  },
];

function RadarChart({
  userProfile,
  cityProfile,
}: {
  userProfile: Profile;
  cityProfile: Profile;
}) {
  const labels = Object.keys(userProfile);
  const size = 260;
  const center = size / 2;
  const maxRadius = 92;
  const maxValue = 5;

  function getPoint(value: number, index: number) {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const radius = (value / maxValue) * maxRadius;

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  function getPolygonPoints(profile: Profile) {
    return labels
      .map((label, index) => {
        const point = getPoint(profile[label], index);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  }

  return (
    <div className="rounded-3xl bg-[#fffaf2] p-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-72 w-full">
        {[1, 2, 3, 4, 5].map((level) => {
          const radius = (level / 5) * maxRadius;
          const points = labels
            .map((_, index) => {
              const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
              return `${center + radius * Math.cos(angle)},${
                center + radius * Math.sin(angle)
              }`;
            })
            .join(" ");

          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#eadfce"
              strokeWidth="1"
            />
          );
        })}

        {labels.map((label, index) => {
          const outer = getPoint(5, index);
          const labelPoint = getPoint(5.75, index);

          return (
            <g key={label}>
              <line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#eadfce"
                strokeWidth="1"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#7d6a5a] text-[11px]"
              >
                {label}
              </text>
            </g>
          );
        })}

        <polygon
          points={getPolygonPoints(cityProfile)}
          fill="#d97745"
          fillOpacity="0.12"
          stroke="#d97745"
          strokeWidth="2"
          strokeDasharray="5 5"
        />

        <polygon
          points={getPolygonPoints(userProfile)}
          fill="#2f2a24"
          fillOpacity="0.1"
          stroke="#2f2a24"
          strokeWidth="2"
        />
      </svg>

      <div className="mt-2 flex justify-center gap-4 text-xs text-[#7d6a5a]">
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-5 rounded-full bg-[#2f2a24]" />
          你的偏好
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-5 rounded-full border border-dashed border-[#d97745]" />
          城市表现
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<CityReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  function handleSelect(option: string) {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (currentIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  async function handleGenerateReport() {
    setIsGenerating(true);
    setGenerateError("");

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = (await response.json()) as {
        report?: CityReport;
        message?: string;
      };

      if (!response.ok || !data.report) {
        throw new Error(data.message || "报告生成失败，请稍后再试。");
      }

      setReport(data.report);
    } catch (error) {
      console.error("生成城市报告失败", error);
      setGenerateError("模型开小差了，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setReport(null);
    setGenerateError("");
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-8 text-[#2f2a24]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between">
        <div>
          {!report && (
            <div className="mb-8">
              <p className="mb-2 text-sm text-[#8a7463]">
                城市人格测试 · {Math.min(currentIndex + 1, questions.length)}/
                {questions.length}
              </p>

              <div className="h-2 overflow-hidden rounded-full bg-[#e4d8c8]">
                <div
                  className="h-full rounded-full bg-[#d97745] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!isFinished && !report ? (
            <div className="rounded-[28px] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
              <p className="mb-3 text-sm font-medium text-[#d97745]">
                Question {String(currentIndex + 1).padStart(2, "0")}
              </p>

              <h1 className="mb-8 text-2xl font-bold leading-snug">
                {currentQuestion.title}
              </h1>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full rounded-2xl border border-[#eadfce] bg-[#fffaf2] px-4 py-4 text-left text-base transition hover:border-[#d97745] hover:bg-[#fff3e2] active:scale-[0.99]"
                  >
                    <span className="mr-3 font-semibold text-[#d97745]">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isFinished && !report ? (
            <div className="rounded-[28px] bg-white/80 p-6 text-center shadow-sm ring-1 ring-black/5">
              <p className="mb-3 text-sm font-medium text-[#d97745]">
                已完成 6/6
              </p>

              <h1 className="mb-4 text-2xl font-bold leading-snug">
                你的城市人格画像已经生成
              </h1>

              <p className="mb-6 text-sm leading-6 text-[#7d6a5a]">
                下一步我们会把你的答案交给 AI，让它从城市知识库里挑出一座最懂你的城市。
              </p>

              {isGenerating ? (
                <p className="mb-3 text-sm leading-6 text-[#7d6a5a]">
                  AI 正在翻你的城市人格档案，通常需要 5-15 秒。
                </p>
              ) : null}

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="mb-3 w-full rounded-2xl bg-[#d97745] px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-[#c86835] active:scale-[0.99]"
              >
                {isGenerating ? "AI 正在匹配中..." : "生成我的城市报告"}
              </button>

              {generateError ? (
                <p className="mb-3 text-sm text-[#b75f32]">{generateError}</p>
              ) : null}

              <button
                onClick={handleRestart}
                className="w-full rounded-2xl border border-[#eadfce] bg-[#fffaf2] px-5 py-4 text-sm font-medium text-[#7d6a5a]"
              >
                重新测试
              </button>
            </div>
          ) : null}

          {report ? (
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
                <p className="text-sm leading-7 text-[#6f5f51]">
                  {report.reason}
                </p>
              </div>

              <p className="mt-5 text-center text-xs text-[#9b8572]">
                截图分享给朋友，看看谁最适合和你住一座城。
              </p>

              <button
                onClick={handleRestart}
                className="mt-5 w-full rounded-2xl border border-[#eadfce] bg-[#fffaf2] px-5 py-4 text-sm font-medium text-[#7d6a5a]"
              >
                重新测试
              </button>
            </div>
          ) : null}
        </div>

        {!report && (
          <div className="mt-8 text-center text-xs text-[#9b8572]">
            答完 6 道灵魂问题，看看哪座城市最懂你。
          </div>
        )}
      </section>
    </main>
  );
}
