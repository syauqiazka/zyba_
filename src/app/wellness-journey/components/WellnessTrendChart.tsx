"use client";

import React, { useState, useId, useEffect } from "react";
import { TrendingUp, Activity, Moon, Brain, Info, Sparkles } from "lucide-react";

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

/**
 * Generates an organic, smooth cubic spline (River of Mindful Seasons)
 * avoiding jagged linear polygon segments.
 */
function createSmoothSplinePath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  if (coords.length === 2) {
    return `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)} L ${coords[1].x.toFixed(1)} ${coords[1].y.toFixed(1)}`;
  }

  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function WellnessTrendChart({ points }: TrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>("score");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const gradientId = useId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Filter valid data points for selected metric
  const validPoints = points.filter((p) => {
    if (selectedMetric === "score") return p.score !== null && p.score !== undefined;
    if (selectedMetric === "stress") return p.stress !== null && p.stress !== undefined;
    if (selectedMetric === "sleep") return p.sleep !== null && p.sleep !== undefined;
    return false;
  });

  const METRIC_CONFIG = {
    score: {
      label: "Skor Zyba",
      icon: Brain,
      min: 0,
      max: 100,
      unit: "poin",
      stroke: "#F2884B",
      fillStart: "rgba(242, 136, 75, 0.28)",
      fillEnd: "rgba(242, 136, 75, 0.0)",
      ticks: [0, 25, 50, 75, 100],
      formatter: (v: number) => `${Math.round(v)}`,
      statusText: (v: number) => {
        if (v >= 80) return "Kondisi Sangat Baik";
        if (v >= 60) return "Cukup Stabil";
        return "Perlu Dukungan";
      },
    },
    stress: {
      label: "Tingkat Stres",
      icon: Activity,
      min: 1,
      max: 5,
      unit: "/5.0",
      stroke: "#8FAE5D",
      fillStart: "rgba(143, 174, 93, 0.28)",
      fillEnd: "rgba(143, 174, 93, 0.0)",
      ticks: [1, 2, 3, 4, 5],
      formatter: (v: number) => v.toFixed(1),
      statusText: (v: number) => {
        if (v <= 2) return "Stres Rendah (Tenang)";
        if (v <= 3.5) return "Stres Sedang";
        return "Stres Menuntut Rehat";
      },
    },
    sleep: {
      label: "Kualitas Istirahat",
      icon: Moon,
      min: 1,
      max: 5,
      unit: "/5.0",
      stroke: "#A99BE0",
      fillStart: "rgba(169, 155, 224, 0.28)",
      fillEnd: "rgba(169, 155, 224, 0.0)",
      ticks: [1, 2, 3, 4, 5],
      formatter: (v: number) => v.toFixed(1),
      statusText: (v: number) => {
        if (v >= 4) return "Tidur Nyenyak";
        if (v >= 3) return "Cukup Istirahat";
        return "Kurang Istirahat";
      },
    },
  };

  const config = METRIC_CONFIG[selectedMetric];

  // Responsive SVG Dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 28, right: 32, bottom: 42, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Calculate Coordinates
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

  // Build Organic Smooth Spline Path
  const linePath = coords.length > 1 ? createSmoothSplinePath(coords) : "";

  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`
      : "";

  const activePoint = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : null;
  const isTopHalf = activePoint ? activePoint.y / svgHeight < 0.35 : false;
  const isNearRightEdge = activePoint ? activePoint.x / svgWidth > 0.78 : false;
  const isNearLeftEdge = activePoint ? activePoint.x / svgWidth < 0.22 : false;

  return (
    <div className="rounded-[20px] border border-brown-900/10 bg-white/95 p-6 sm:p-8 shadow-xs flex flex-col gap-4 transition-all">
      {/* Chart Header & Metric Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brown-900/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <Sparkles size={11} className="text-orange-500" />
              Kurva Riak Tenang
            </span>
          </div>
          <h3 className="font-display text-lg font-bold text-brown-900 tracking-tight mt-1.5 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            <span>Tren Dinamika Kesejahteraan</span>
          </h3>
          <p className="text-xs text-brown-700/70 mt-0.5">
            Pola perubahan metrik berdasarkan catatan harianmu tanpa angka persentase yang menekan.
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
                    ? "bg-brown-900 text-white shadow-2xs"
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
        <div className="py-14 text-center flex flex-col items-center justify-center gap-2.5 bg-cream/35 rounded-2xl border border-dashed border-brown-900/10">
          <Info size={22} className="text-brown-700/50" />
          <p className="text-xs font-bold text-brown-900">
            Belum Cukup Data Tren
          </p>
          <p className="text-xs text-brown-700/70 max-w-sm leading-relaxed">
            {validPoints.length === 1
              ? "Tercatat 1 data check-in. Lakukan check-in di hari berikutnya untuk mulai melihat garis visual gelombang tren perkembanganmu."
              : "Lakukan setidaknya 2 kali Check-In Harian agar kurva riak gelombang dapat divisualisasikan."}
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-visible">
          {/* Active Tooltip Popover */}
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
              <div className="bg-brown-900 text-cream px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-white/10 flex flex-col gap-0.5 whitespace-nowrap">
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

          {/* Responsive SVG Smooth Spline Chart */}
          <div className="w-full">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.stroke} stopOpacity="0.25" />
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
                    stroke="rgba(59, 42, 32, 0.22)"
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

              {/* Shaded Organic Spline Area */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill={`url(#${gradientId})`}
                  className={reducedMotion ? "" : "transition-all duration-300"}
                />
              )}

              {/* Smooth Spline Curve Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={config.stroke}
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={reducedMotion ? "" : "transition-all duration-300"}
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
                    {/* Hit target */}
                    <circle cx={c.x} cy={c.y} r="14" fill="transparent" />

                    {/* Tactile Pebble Dot */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isHovered ? "6.5" : "4.5"}
                      fill="#FFFFFF"
                      stroke={config.stroke}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-150"
                    />

                    {/* X-axis date labels */}
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
            <span>Arahkan kursor ke titik riak untuk rincian tanggal dan status.</span>
            <span>{validPoints.length} titik riak tercatat</span>
          </div>
        </div>
      )}
    </div>
  );
}
