import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blackoutEvents } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 2: 全球停电地图 — 60年的黑暗版图
 * 滚动驱动事件按时间顺序脉冲亮起，结尾淡出过渡到五幕
 */

function geoToSvg(lng: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lng + 180) / 360) * w;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = h / 2 - (mercN / Math.PI) * (h / 2);
  return [x, y];
}

const sortedEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

export default function GlobalMapScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [phase, setPhase] = useState<"map" | "outro" | "exit">("map");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=400%",
        scrub: 1.5,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const p = self.progress;

          if (p < 0.65) {
            // 事件依次激活
            setPhase("map");
            const eventProgress = p / 0.65;
            const idx = Math.floor(eventProgress * sortedEvents.length) - 1;
            setActiveIndex(Math.min(idx, sortedEvents.length - 1));
          } else if (p < 0.85) {
            // 结尾文字
            setPhase("outro");
          } else {
            // 淡出退场
            setPhase("exit");
          }
        },
      });

      // 结尾文字动画
      gsap.fromTo(
        container.querySelector(".map-outro-text"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=400%",
            scrub: 1.5,
            // 在 65%-80% 范围内渐入
            onUpdate: (self) => {
              const el = container.querySelector<HTMLElement>(".map-outro-text");
              if (!el) return;
              const p = self.progress;
              if (p > 0.65 && p < 0.85) {
                el.style.opacity = String((p - 0.65) / 0.1);
              } else if (p >= 0.85) {
                el.style.opacity = String(Math.max(0, 1 - (p - 0.85) / 0.15));
              } else {
                el.style.opacity = "0";
              }
            },
          },
        }
      );
    }, container);

    return () => gsapCtx.revert();
  }, []);

  const svgW = 1000;
  const svgH = 500;
  const isExiting = phase === "exit";

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-deep-black">
      <div
        className="h-full w-full relative flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        {/* 标题 */}
        <h2 className="absolute top-10 left-1/2 -translate-x-1/2 z-10">
          <span className="font-mono text-amber/40 text-xs tracking-[0.3em]">1965 — 2025</span>
          <span className="block font-serif text-lg md:text-xl text-text-secondary/50 tracking-[0.15em] mt-1 text-center">
            黑暗版图
          </span>
        </h2>

        {/* SVG 地图 */}
        <div className="relative w-full max-w-5xl mx-auto px-4">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
            <defs>
              <radialGradient id="map-bg-glow">
                <stop offset="0%" stopColor="rgba(59,130,246,0.03)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <rect width={svgW} height={svgH} fill="#080c14" rx="6" />
            <ellipse cx={svgW / 2} cy={svgH / 2} rx="400" ry="200" fill="url(#map-bg-glow)" />

            {/* 网格线 */}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={(svgH / 6) * i} x2={svgW} y2={(svgH / 6) * i}
                stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" strokeDasharray="4 8" />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={(svgW / 12) * i} y1={0} x2={(svgW / 12) * i} y2={svgH}
                stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" strokeDasharray="4 8" />
            ))}

            {/* 事件标记 */}
            {sortedEvents.map((event, idx) => {
              const [cx, cy] = geoToSvg(event.coordinates[0], event.coordinates[1], svgW, svgH);
              const isActive = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <g key={event.id}>
                  {/* 涟漪 */}
                  {isCurrent && (
                    <>
                      <circle cx={cx} cy={cy} r="3" fill="none" stroke="#F59E0B" strokeWidth="0.8">
                        <animate attributeName="r" from="3" to="30" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={cx} cy={cy} r="3" fill="none" stroke="#F59E0B" strokeWidth="0.4">
                        <animate attributeName="r" from="3" to="45" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.3" to="0" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}

                  {/* 点 */}
                  <circle
                    cx={cx} cy={cy}
                    r={isCurrent ? 4.5 : isActive ? 3 : 1.5}
                    fill={isCurrent ? "#F59E0B" : isActive ? "#EF4444" : "rgba(71,85,105,0.2)"}
                    style={{
                      transition: "all 0.6s ease",
                      filter: isActive ? `drop-shadow(0 0 ${isCurrent ? 10 : 4}px rgba(${isCurrent ? "245,158,11" : "239,68,68"},0.5))` : "none",
                    }}
                  />

                  {/* 年份 */}
                  {isActive && (
                    <text x={cx} y={cy - 12} textAnchor="middle" fill={isCurrent ? "#F1F5F9" : "#94A3B8"}
                      fontSize="7" fontFamily="JetBrains Mono, monospace" opacity={isCurrent ? 0.9 : 0.3}>
                      {event.year}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 当前事件信息 */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 text-center min-h-[80px] w-full max-w-lg px-6">
          {activeIndex >= 0 && activeIndex < sortedEvents.length && phase === "map" && (
            <div key={sortedEvents[activeIndex].id} className="animate-fade-in">
              <span className="font-mono text-amber text-lg md:text-xl tracking-wider">
                {sortedEvents[activeIndex].year}
              </span>
              <span className="text-text-tertiary/30 mx-3">|</span>
              <span className="font-serif text-text-primary text-lg md:text-xl">
                {sortedEvents[activeIndex].nameCn}
              </span>
              <p className="text-text-secondary/50 text-sm mt-2 italic">
                "{sortedEvents[activeIndex].hook}"
              </p>
            </div>
          )}
        </div>

        {/* 结尾过渡文字 */}
        <div className="map-outro-text absolute inset-0 z-30 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
          <div className="text-center">
            <p className="font-serif text-xl md:text-3xl text-text-primary/80">
              每一个光点
            </p>
            <p className="font-serif text-xl md:text-3xl text-text-primary/80 mt-2">
              都是一段<span className="text-amber">黑暗</span>的记忆
            </p>
          </div>
        </div>

        {/* 底部时间轴 */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="relative h-px bg-text-tertiary/10 rounded-full overflow-visible">
            {/* 进度条 */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber/50 to-amber/20 transition-all duration-500"
              style={{
                width: `${activeIndex >= 0 ? ((sortedEvents[Math.min(activeIndex, sortedEvents.length - 1)]?.year - 1965) / (2025 - 1965)) * 100 : 0}%`,
              }}
            />
            {sortedEvents.map((event, idx) => {
              const pos = ((event.year - 1965) / (2025 - 1965)) * 100;
              const isActive = idx <= activeIndex;
              return (
                <div
                  key={event.id}
                  className="absolute -top-[3px] w-[6px] h-[6px] rounded-full transition-all duration-500"
                  style={{
                    left: `${pos}%`,
                    transform: "translateX(-50%)",
                    backgroundColor: isActive ? "#F59E0B" : "rgba(71,85,105,0.3)",
                    boxShadow: isActive ? "0 0 6px rgba(245,158,11,0.4)" : "none",
                  }}
                />
              );
            })}
            <span className="absolute -bottom-5 left-0 text-text-tertiary/30 text-[10px] font-mono">1965</span>
            <span className="absolute -bottom-5 right-0 text-text-tertiary/30 text-[10px] font-mono">2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
