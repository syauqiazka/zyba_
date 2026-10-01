"use client";

import React, { useState, useId } from "react";
import { TrendingUp, Activity, Moon, Brain, Info } from "lucide-react";

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "1 Okt"
  score: number | null; // 0 - 100
  stress: number | null; // 1 - 5
  sleep: number | null; // 1 - 5
  mood: string | null;
}

export type TrendMetric = "score" | "stress" | "sleep";

interface TrendChartProps {
  points: TrendPoint[];
}

export default function WellnessTrendChart({ points }: TrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>("score");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId();

  // Filter valid data points for selected metric
  const validPoints = points.filter((p) => {
    if (selectedMetric === "score") return p.score !== null && p.score !== undefined;
    if (selectedMetric === "stress") return p.stress !== null && p.stress !== undefined;
    if (selectedMetric === "sleep") return p.sleep !== null && p.sleep !== undefined;
    return false;
  });

  const METRIC_CONFIG = {
    score: {
      label: "ZYBA Score",
      icon: Brain,
      min: 0,
      max: 100,
      unit: "poin",
      stroke: "#F2884B",
      fillStart: "rgba(242, 136, 75, 0.25)",
      fillEnd: "rgba(242, 136, 75, 0.0)",
      ticks: [0, 25, 50, 75, 100],
      formatter: (v: number) => `${Math.round(v)}`,
      statusText: (v: number) => {
        if (v >= 80) return "Kondisi Baik";
        if (v >= 60) return "Cukup Stabil";
        return "Perlu Perhatian";
      },
    },
    stress: {
      label: "Tingkat Stres",
      icon: Activity,
      min: 1,
      max: 5,
      unit: "/5.0",
      stroke: "#8FAE5D",
      fillStart: "rgba(143, 174, 93, 0.25)",
      fillEnd: "rgba(143, 174, 93, 0.0)",
      ticks: [1, 2, 3, 4, 5],
      formatter: (v: number) => v.toFixed(1),
      statusText: (v: number) => {
        if (v <= 2) return "Stres Rendah (Baik)";
        if (v <= 3.5) return "Stres Sedang";
        return "Stres Cukup Tinggi";
      },
    },
    sleep: {
      label: "Kualitas Istirahat",
      icon: Moon,
      min: 1,
      max: 5,
      unit: "/5.0",
      stroke: "#456882",
      fillStart: "rgba(69, 104, 130, 0.25)",
      fillEnd: "rgba(69, 104, 130, 0.0)",
      ticks: [1, 2, 3, 4, 5],
      formatter: (v: number) => v.toFixed(1),
      statusText: (v: number) => {
        if (v >= 4) return "Tidur Nyenyak";
        if (v >= 3) return "Cukup Istirahat";
        return "Kurang Tidur";
      },
    },
  };

  const config = METRIC_CONFIG[selectedMetric];

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Calculate coordinates
  const getCoordinates = () => {
    if (validPoints.length === 0) return [];

    return validPoints.map((p, idx) => {
      let rawVal = 0;
      if (selectedMetric === "score") rawVal = p.score ?? 0;
      if (selectedMetric === "stress") rawVal = p.stress ?? 1;
      if (selectedMetric === "sleep") rawVal = p.sleep ?? 1;

      const normalizedY = (rawVal - config.min) / (config.max - config.min);
      const x =
        validPoints.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + (idx / (validPoints.length - 1)) * chartWidth;
      const y = padding.top + (1 - Math.max(0, Math.min(1, normalizedY))) * chartHeight;

      return { x, y, point: p, val: rawVal };
    });
  };

  const coords = getCoordinates();

  // Average line calculation
  const averageVal =
    validPoints.length > 0
      ? coords.reduce((acc, c) => acc + c.val, 0) / validPoints.length
      : null;
  const averageY =
    averageVal !== null
      ? padding.top +
        (1 - (averageVal - config.min) / (config.max - config.min)) * chartHeight
      : null;

  // Build SVG path
  const linePath = coords.length > 1
    ? coords.reduce((acc, c, i) => `${acc} ${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`, "")
    : "";

  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`
      : "";

  const activePoint = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : null;
  const isTopHalf = activePoint ? (activePoint.y / svgHeight) < 0.35 : false;
  const isNearRightEdge = activePoint ? (activePoint.x / svgWidth) > 0.78 : false;
  const isNearLeftEdge = activePoint ? (activePoint.x / svgWidth) < 0.22 : false;

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      {/* Chart Header & Metric Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brown-900/5">
        <div>
          <h3 className="font-display text-base font-bold text-brown-900 tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            <span>Tren Perkembangan Kondisi</span>
          </h3>
          <p className="text-xs text-brown-700/70 mt-0.5">
            Pola perubahan metrik berdasarkan data check-in harianmu.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-cream/70 rounded-xl border border-brown-900/10 self-start sm:self-auto">
          {(["score", "stress", "sleep"] as TrendMetric[]).map((metric) => {
            const isSelected = selectedMetric === metric;
            const item = METRIC_CONFIG[metric];
            const Icon = item.icon;
            return (
              <button
                key={metric}
                type="button"
                onClick={() => {
                  setSelectedMetric(metric);
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brown-900 text-white shadow-xs"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State when less than 2 data points */}
      {validPoints.length < 2 ? (
        <div className="py-14 text-center flex flex-col items-center justify-center gap-2.5 bg-cream/30 rounded-2xl border border-dashed border-brown-900/10">
          <Info size={22} className="text-brown-700/50" />
          <p className="text-xs font-bold text-brown-900">
            Belum Cukup Data Tren
          </p>
          <p className="text-xs text-brown-700/70 max-w-sm">
            {validPoints.length === 1
              ? "Tercatat 1 data check-in. Lakukan check-in di hari berikutnya untuk mulai melihat garis visual tren perkembanganmu."
              : "Lakukan setidaknya 2 kali Check-In Harian agar grafik tren dapat divisualisasikan."}
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-visible">
          {/* Active tooltip popover */}
          {activePoint && (
            <div
              className={`absolute z-30 pointer-events-none transform transition-all duration-150 ${
                isTopHalf ? "translate-y-0" : "-translate-y-full"
              } ${
                isNearRightEdge
                  ? "-translate-x-[90%]"
                  : isNearLeftEdge
                  ? "-translate-x-[10%]"
                  : "-translate-x-1/2"
              }`}
              style={{
                left: `${(activePoint.x / svgWidth) * 100}%`,
                top: `${(activePoint.y / svgHeight) * 100}%`,
                marginTop: isTopHalf ? "14px" : "-14px",
              }}
            >
              <div className="bg-brown-900 text-cream px-3.5 py-2 rounded-xl text-xs shadow-xl border border-white/10 flex flex-col gap-0.5 whitespace-nowrap">
                <span className="text-[10px] text-cream/70 font-medium">
                  {activePoint.point.date}
                </span>
                <span className="font-bold text-sm">
                  {config.formatter(activePoint.val)} {config.unit}
                </span>
                <span className="text-[10px] text-orange-300 font-medium">
                  {config.statusText(activePoint.val)}
                </span>
              </div>
            </div>
          )}

          {/* Responsive SVG Chart */}
          <div className="w-full">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.stroke} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={config.stroke} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {config.ticks.map((tick) => {
                const normY = (tick - config.min) / (config.max - config.min);
                const y = padding.top + (1 - normY) * chartHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="rgba(59, 42, 32, 0.08)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="10"
                      fill="rgba(90, 70, 54, 0.6)"
                      fontWeight="500"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Average reference line */}
              {averageY !== null && (
                <g>
                  <line
                    x1={padding.left}
                    y1={averageY}
                    x2={svgWidth - padding.right}
                    y2={averageY}
                    stroke="rgba(59, 42, 32, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={svgWidth - padding.right}
                    y={averageY - 5}
                    textAnchor="end"
                    fontSize="9"
                    fill="rgba(90, 70, 54, 0.7)"
                    fontWeight="600"
                  >
                    Rata-rata: {config.formatter(averageVal!)}
                  </text>
                </g>
              )}

              {/* Shaded Area */}
              {areaPath && (
                <path d={areaPath} fill={`url(#${gradientId})`} />
              )}

              {/* Main Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={config.stroke}
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points and Interaction Circles */}
              {coords.map((c, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <g
                    key={c.point.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Larger transparent hit target */}
                    <circle cx={c.x} cy={c.y} r="14" fill="transparent" />

                    {/* Visible dot */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isHovered ? "6" : "4"}
                      fill="#FFFFFF"
                      stroke={config.stroke}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-150"
                    />

                    {/* X-axis date labels */}
                    {/* Show label if small number of points or at reasonable steps */}
                    {(validPoints.length <= 10 ||
                      i === 0 ||
                      i === validPoints.length - 1 ||
                      i % Math.ceil(validPoints.length / 7) === 0) && (
                      <text
                        x={c.x}
                        y={padding.top + chartHeight + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fill={isHovered ? "#3B2A20" : "rgba(90, 70, 54, 0.7)"}
                        fontWeight={isHovered ? "700" : "500"}
                      >
                        {c.point.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-brown-700/60 pt-2 border-t border-brown-900/5 px-1">
            <span>Arahkan kursor ke titik grafik untuk detail tanggal dan status.</span>
            <span>{validPoints.length} titik data tercatat</span>
          </div>
        </div>
      )}
    </div>
  );
}
