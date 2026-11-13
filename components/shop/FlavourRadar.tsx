"use client";

import { useMemo } from "react";
import { FlavourProfile } from "@/data/products";

interface FlavourRadarProps {
  profile: FlavourProfile;
  size?: number;
  dark?: boolean;
}

export default function FlavourRadar({
  profile,
  size = 200,
  dark = false,
}: FlavourRadarProps) {
  const axes = [
    { key: "acidity", label: "Acidity" },
    { key: "sweetness", label: "Sweetness" },
    { key: "fruitiness", label: "Fruitiness" },
    { key: "body", label: "Body" },
    { key: "bitterness", label: "Bitterness" },
  ] as const;

  const center = size / 2;
  const radius = size * 0.38;
  const count = axes.length;

  // Calculate polygon points
  const points = useMemo(() => {
    return axes
      .map((axis, i) => {
        const val = profile[axis.key] || 0;
        const normalized = Math.max(1, Math.min(10, val)) / 10;
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const r = radius * normalized;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  }, [profile, count, radius, center]);

  // Concentric polygon background grids (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map((lvl) => {
          const gridPoints = axes
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
              const r = radius * lvl;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill="none"
              stroke={dark ? "rgba(239, 235, 227, 0.15)" : "rgba(13, 27, 22, 0.12)"}
              strokeWidth="1"
              strokeDasharray={lvl < 1 ? "2 2" : undefined}
            />
          );
        })}

        {/* Radial Axis Spokes */}
        {axes.map((axis, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const labelDist = radius + 18;
          const labelX = center + labelDist * Math.cos(angle);
          const labelY = center + labelDist * Math.sin(angle);

          return (
            <g key={axis.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={dark ? "rgba(239, 235, 227, 0.2)" : "rgba(13, 27, 22, 0.15)"}
                strokeWidth="1"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={`font-mono text-[9px] uppercase tracking-wider ${
                  dark ? "fill-[#EFEBE3]/70" : "fill-[#0D1B16]/70"
                }`}
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Data Shape Polygon with Vermilion Accent */}
        <polygon
          points={points}
          fill="rgba(232, 71, 43, 0.25)"
          stroke="#E8472B"
          strokeWidth="2"
        />

        {/* Axis Value Vertex Dots */}
        {axes.map((axis, i) => {
          const val = profile[axis.key] || 0;
          const normalized = Math.max(1, Math.min(10, val)) / 10;
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const r = radius * normalized;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);

          return (
            <circle
              key={axis.key}
              cx={x}
              cy={y}
              r="3.5"
              fill="#E8472B"
              stroke={dark ? "#0D1B16" : "#EFEBE3"}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
