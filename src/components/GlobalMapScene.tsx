import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blackoutEvents } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 2: 全球停电地图 — 60年的黑暗版图
 *
 * 使用 CSS/SVG 世界地图代替 Mapbox（避免 API key 依赖）。
 * 滚动驱动事件按时间顺序在地图上脉冲亮起。
 *
 * 注意：如果团队有 Mapbox token，可以替换为 Mapbox GL JS 版本。
 */

// 将经纬度转换为 SVG 简单投影坐标 (Mercator-like)
function geoToSvg(
  lng: number,
  lat: number,
  width: number,
  height: number
): [number, number] {
  const x = ((lng + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height / 2);
  return [x, y];
}

// 按时间排序的事件
const sortedEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

export default function GlobalMapScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          // 根据滚动进度激活事件 (前 80% 用于事件激活，后 20% 用于结尾文字)
          const eventProgress = Math.min(self.progress / 0.75, 1);
          const idx = Math.floor(eventProgress * sortedEvents.length) - 1;
          setActiveIndex(Math.min(idx, sortedEvents.length - 1));
        },
      },
    });

    // 结尾文字
    tl.fromTo(
      ".map-outro",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.15 },
      0.8
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const svgW = 1000;
  const svgH = 500;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-deep-black"
      style={{ height: "400vh" }}
    >
      <div className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
        {/* 标题 */}
        <h2 className="absolute top-8 left-1/2 -translate-x-1/2 z-10 font-serif text-xl md:text-2xl text-text-secondary/70 tracking-widest">
          60年 · 黑暗版图
        </h2>

        {/* SVG 世界地图 */}
        <div className="relative w-full max-w-6xl mx-auto px-4">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full h-auto"
            style={{ filter: "drop-shadow(0 0 40px rgba(245,158,11,0.05))" }}
          >
            {/* 简化的世界轮廓 — 用深色矩形作为海洋背景 */}
            <rect
              width={svgW}
              height={svgH}
              fill="#0a0e1a"
              rx="8"
            />
            {/* 经纬度网格线 */}
            {Array.from({ length: 7 }, (_, i) => {
              const y = (svgH / 6) * i;
              return (
                <line
                  key={`lat-${i}`}
                  x1={0} y1={y} x2={svgW} y2={y}
                  stroke="rgba(59,130,246,0.08)"
                  strokeWidth="0.5"
                />
              );
            })}
            {Array.from({ length: 13 }, (_, i) => {
              const x = (svgW / 12) * i;
              return (
                <line
                  key={`lng-${i}`}
                  x1={x} y1={0} x2={x} y2={svgH}
                  stroke="rgba(59,130,246,0.08)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* 事件标记 */}
            {sortedEvents.map((event, idx) => {
              const [cx, cy] = geoToSvg(
                event.coordinates[0],
                event.coordinates[1],
                svgW,
                svgH
              );
              const isActive = idx <= activeIndex;
              const isCurrentlyActivating = idx === activeIndex;

              return (
                <g key={event.id}>
                  {/* 涟漪扩散 */}
                  {isCurrentlyActivating && (
                    <>
                      <circle
                        cx={cx} cy={cy} r="3"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="1"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          from="3" to="25"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8" to="0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={cx} cy={cy} r="3"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="0.5"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from="3" to="40"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5" to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* 标记点 */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 4 : 2}
                    fill={
                      isCurrentlyActivating
                        ? "#F59E0B"
                        : isActive
                          ? "#EF4444"
                          : "rgba(71,85,105,0.3)"
                    }
                    style={{
                      transition: "all 0.5s ease",
                      filter: isActive
                        ? "drop-shadow(0 0 6px rgba(239,68,68,0.5))"
                        : "none",
                    }}
                  />

                  {/* 年份标签 */}
                  {isActive && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      opacity={isCurrentlyActivating ? 1 : 0.4}
                    >
                      {event.year}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 当前激活事件信息 */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-center min-h-[80px]">
          {activeIndex >= 0 && activeIndex < sortedEvents.length && (
            <div
              key={sortedEvents[activeIndex].id}
              className="animate-fade-in"
            >
              <span className="font-mono text-amber text-lg md:text-xl">
                {sortedEvents[activeIndex].year}
              </span>
              <span className="text-text-tertiary mx-3">·</span>
              <span className="font-serif text-text-primary text-lg md:text-xl">
                {sortedEvents[activeIndex].nameCn}
              </span>
              <p className="text-text-secondary/70 text-sm mt-2">
                {sortedEvents[activeIndex].hook}
              </p>
            </div>
          )}
        </div>

        {/* 底部时间轴 */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="relative h-px bg-text-tertiary/20">
            {sortedEvents.map((event, idx) => {
              const pos =
                ((event.year - 1965) / (2025 - 1965)) * 100;
              const isActive = idx <= activeIndex;
              return (
                <div
                  key={event.id}
                  className="absolute -top-1 w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    left: `${pos}%`,
                    backgroundColor: isActive ? "#F59E0B" : "#475569",
                    boxShadow: isActive
                      ? "0 0 8px rgba(245,158,11,0.5)"
                      : "none",
                  }}
                />
              );
            })}
            {/* 年份刻度 */}
            <span className="absolute -bottom-5 left-0 text-text-tertiary/40 text-xs font-mono">
              1965
            </span>
            <span className="absolute -bottom-5 right-0 text-text-tertiary/40 text-xs font-mono">
              2025
            </span>
          </div>
        </div>

        {/* 结尾文字 */}
        <div className="map-outro absolute inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none">
          <p className="font-serif text-xl md:text-3xl text-text-primary/80 text-center">
            每一个光点，都是一段<span className="text-amber">黑暗</span>
            的记忆
          </p>
        </div>
      </div>
    </section>
  );
}
