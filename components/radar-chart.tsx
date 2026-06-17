import type { Profile } from "@/lib/mock-report";

export function RadarChart({
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
