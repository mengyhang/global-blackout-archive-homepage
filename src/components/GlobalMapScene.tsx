import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { blackoutEvents } from "../data/blackouts";

/**
 * Scene 2: 全球停电地图 — 60年的黑暗版图
 *
 * - 使用 Natural Earth 110m 真实地图数据（运行时从 CDN 加载）
 * - 太平洋居中投影（东方习惯，美洲在右侧）
 * - 等距圆柱投影
 */

// 太平洋居中：中心经度 150°E，左边界 -30°(30°W)
// 纬度范围限制：-70° 到 82°，避免极地过度拉伸
// 纬度映射范围：82°N 到 78°S，超出部分被 SVG viewBox 自然裁剪（不 clamp，避免水平线）
const LAT_MAX = 82;
const LAT_MIN = -78;

function geoToSvg(lng: number, lat: number, w: number, h: number): [number, number] {
  const shifted = ((lng + 30 + 360) % 360);
  const x = (shifted / 360) * w;
  // 不 clamp —— 超出范围的点自然落在 viewBox 之外，由 SVG 裁剪
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * h;
  return [x, y];
}

const sortedEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

/** 将 GeoJSON 坐标环转换为 SVG path，自动在反经线处断开避免横穿伪影 */
function ringToPath(ring: number[][], w: number, h: number): string {
  let d = "";
  let prevX = -1;
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i];
    const [x, y] = geoToSvg(lng, lat, w, h);
    if (i === 0) {
      d += `M${x.toFixed(1)},${y.toFixed(1)}`;
    } else {
      // 如果 x 坐标跳跃超过地图宽度的 40%，说明跨越了反经线，断开路径
      const jump = Math.abs(x - prevX);
      if (jump > w * 0.4) {
        d += `M${x.toFixed(1)},${y.toFixed(1)}`;
      } else {
        d += `L${x.toFixed(1)},${y.toFixed(1)}`;
      }
    }
    prevX = x;
  }
  return d;
}

export default function GlobalMapScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [phase, setPhase] = useState<"map" | "outro" | "exit">("map");
  const [landPaths, setLandPaths] = useState<string[]>([]);

  // 加载 Natural Earth 地图数据
  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        // 使用 CDN 上的 Natural Earth 110m 数据
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json");
        const topo = await res.json();

        // 手动解析 TopoJSON → GeoJSON coordinates
        const land = topo.objects.land;
        const arcs: number[][][] = [];
        const { scale, translate } = topo.transform;

        // 解码 arcs（delta-encoded）
        for (const arc of topo.arcs) {
          const decoded: number[][] = [];
          let x = 0, y = 0;
          for (const [dx, dy] of arc) {
            x += dx;
            y += dy;
            decoded.push([
              x * scale[0] + translate[0],
              y * scale[1] + translate[1],
            ]);
          }
          arcs.push(decoded);
        }

        // 从 arc 索引构建坐标环
        function resolveRing(indices: number[]): number[][] {
          const coords: number[][] = [];
          for (const idx of indices) {
            const arc = idx >= 0 ? arcs[idx] : [...arcs[~idx]].reverse();
            for (let i = coords.length > 0 ? 1 : 0; i < arc.length; i++) {
              coords.push(arc[i]);
            }
          }
          return coords;
        }

        const paths: string[] = [];
        const svgW = 1000, svgH = 500;

        for (const geom of land.geometries) {
          if (geom.type === "Polygon") {
            for (const ring of geom.arcs) {
              const coords = resolveRing(ring);
              if (coords.length > 3) paths.push(ringToPath(coords, svgW, svgH));
            }
          } else if (geom.type === "MultiPolygon") {
            for (const polygon of geom.arcs) {
              for (const ring of polygon) {
                const coords = resolveRing(ring);
                if (coords.length > 3) paths.push(ringToPath(coords, svgW, svgH));
              }
            }
          }
        }

        if (!cancelled) setLandPaths(paths);
      } catch (e) {
        console.warn("Failed to load world map data:", e);
      }
    }

    loadMap();
    return () => { cancelled = true; };
  }, []);

  // 时间线动画
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let tl: gsap.core.Timeline;

    const startAnimation = () => {
      if (tl) tl.kill();

      // 重置状态
      setActiveIndex(-1);
      setPhase("map");
      const outroEl = container.querySelector<HTMLElement>(".map-outro-text");
      if (outroEl) outroEl.style.opacity = "0";

      tl = gsap.timeline();

      // 逐个激活事件标记
      sortedEvents.forEach((_, idx) => {
        tl.call(() => setActiveIndex(idx), [], idx * 1.5);
        tl.to({}, { duration: 1.5 });
      });

      // 结尾文字 — 常驻不消失
      tl.call(() => setPhase("outro"));
      tl.to(".map-outro-text", { opacity: 1, duration: 1 });
    };

    startAnimation();

    const handleSceneEnter = () => {
      startAnimation();
    };

    const handleTogglePlay = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.isPlaying) {
        tl?.play();
      } else {
        tl?.pause();
      }
    };

    window.addEventListener('scene-enter', handleSceneEnter);
    window.addEventListener('scene-toggle-play', handleTogglePlay);

    return () => {
      window.removeEventListener('scene-enter', handleSceneEnter);
      window.removeEventListener('scene-toggle-play', handleTogglePlay);
      if (tl) tl.kill();
    };
  }, [landPaths]);

  const svgW = 1000;
  const svgH = 500;
  const isExiting = phase === "exit";

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-deep-black">
      <div
        className="h-full w-full relative flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        {/* 标题 — 优化视觉效果 */}
        <h2 className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
          <span className="block font-serif text-3xl md:text-4xl text-text-primary/90 tracking-[0.2em] mb-3 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            黑暗版图
          </span>
          <span className="font-mono text-amber/70 text-sm tracking-[0.4em]">1965 — 2025</span>
        </h2>

        {/* SVG 地图 — 全屏无边框 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="map-bg-glow">
                <stop offset="0%" stopColor="rgba(59,130,246,0.05)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <ellipse cx={svgW / 2} cy={svgH / 2} rx="450" ry="250" fill="url(#map-bg-glow)" />

            {/* 网格线 */}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={(svgH / 6) * i} x2={svgW} y2={(svgH / 6) * i}
                stroke="rgba(59,130,246,0.06)" strokeWidth="0.5" strokeDasharray="4 8" />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={(svgW / 12) * i} y1={0} x2={(svgW / 12) * i} y2={svgH}
                stroke="rgba(59,130,246,0.06)" strokeWidth="0.5" strokeDasharray="4 8" />
            ))}

            {/* 真实海岸线（Natural Earth 数据）— 增强清晰度 */}
            {landPaths.length > 0 && (
              <g>
                {landPaths.map((d, i) => (
                  <path key={i} d={d}
                    fill="none"
                    stroke="rgba(100,150,200,0.35)"
                    strokeWidth="1.2"
                    strokeLinejoin="round" />
                ))}
              </g>
            )}

            {/* 已激活事件连线 */}
            {sortedEvents.map((event, idx) => {
              if (idx === 0 || idx > activeIndex) return null;
              const prev = sortedEvents[idx - 1];
              const [x1, y1] = geoToSvg(prev.coordinates[0], prev.coordinates[1], svgW, svgH);
              const [x2, y2] = geoToSvg(event.coordinates[0], event.coordinates[1], svgW, svgH);
              return (
                <line key={`link-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(245,158,11,0.06)" strokeWidth="0.5" strokeDasharray="3 6" />
              );
            })}

            {/* 事件标记 — 增强动态特效 */}
            {sortedEvents.map((event, idx) => {
              const [cx, cy] = geoToSvg(event.coordinates[0], event.coordinates[1], svgW, svgH);
              const isActive = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <g key={event.id}>
                  {isCurrent && (
                    <>
                      <circle cx={cx} cy={cy} r="5" fill="none" stroke="#F59E0B" strokeWidth="2">
                        <animate attributeName="r" from="5" to="35" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={cx} cy={cy} r="5" fill="none" stroke="#EF4444" strokeWidth="1.5">
                        <animate attributeName="r" from="5" to="50" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={cx} cy={cy} r="5" fill="none" stroke="#FBBF24" strokeWidth="1">
                        <animate attributeName="r" from="5" to="25" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  <circle cx={cx} cy={cy}
                    r={isCurrent ? 5.5 : isActive ? 3.5 : 2}
                    fill={isCurrent ? "#F59E0B" : isActive ? "#EF4444" : "rgba(71,85,105,0.3)"}
                    style={{
                      transition: "all 0.6s ease",
                      filter: isActive ? `drop-shadow(0 0 ${isCurrent ? 16 : 6}px rgba(${isCurrent ? "245,158,11" : "239,68,68"},0.7))` : "none",
                    }}
                  />
                  {isActive && (
                    <text x={cx} y={cy - 14} textAnchor="middle" fill={isCurrent ? "#FFF" : "#94A3B8"}
                      fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight={isCurrent ? "600" : "400"}
                      opacity={isCurrent ? 1 : 0.5}>
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
              <span className="text-text-tertiary/40 mx-3">|</span>
              <span className="font-serif text-text-primary text-lg md:text-xl">
                {sortedEvents[activeIndex].nameCn}
              </span>
              <p className="text-text-secondary/60 text-sm mt-2 italic">
                "{sortedEvents[activeIndex].hook}"
              </p>
            </div>
          )}
        </div>

        {/* 结尾文字 */}
        <div className="map-outro-text absolute inset-0 z-30 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
          <div className="text-center">
            <p className="font-serif text-xl md:text-3xl text-text-primary/80">每一个光点</p>
            <p className="font-serif text-xl md:text-3xl text-text-primary/80 mt-2">
              都是一段<span className="text-amber">黑暗</span>的记忆
            </p>
          </div>
        </div>

        {/* 底部时间轴 — 延伸到1965前和2025后，首尾淡入淡出 */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="relative h-[2px] rounded-full overflow-visible">
            {/* 背景线条：三段式 - 左淡入 + 中间实线 + 右淡出 */}
            <div className="absolute inset-0 flex">
              <div className="w-[10%] bg-gradient-to-r from-transparent to-text-tertiary/20" />
              <div className="flex-1 bg-text-tertiary/20" />
              <div className="w-[10%] bg-gradient-to-r from-text-tertiary/20 to-transparent" />
            </div>

            {/* 进度线条：三段式 - 左淡入 + 中间实线 + 右淡出 */}
            <div
              className="absolute top-0 h-full flex transition-all duration-500"
              style={{
                left: '10%',
                width: `${activeIndex >= 0 ? ((sortedEvents[Math.min(activeIndex, sortedEvents.length - 1)]?.year - 1965) / (2025 - 1965)) * 80 : 0}%`,
              }}
            >
              <div className="w-[12.5%] bg-gradient-to-r from-transparent to-amber/60" />
              <div className="flex-1 bg-amber/60" />
              <div className="w-[12.5%] bg-gradient-to-r from-amber/60 to-transparent" />
            </div>

            {sortedEvents.map((event, idx) => {
              // 事件点位置：在10%-90%区间内分布
              const pos = 10 + ((event.year - 1965) / (2025 - 1965)) * 80;
              const isActive = idx <= activeIndex;
              return (
                <div key={event.id}
                  className="absolute -top-[2px] w-[6px] h-[6px] rounded-full transition-all duration-500 group cursor-pointer"
                  style={{
                    left: `${pos}%`, transform: "translateX(-50%)",
                    backgroundColor: isActive ? "#F59E0B" : "rgba(71,85,105,0.3)",
                    boxShadow: isActive ? "0 0 6px rgba(245,158,11,0.4)" : "none",
                  }}
                >
                  {/* 悬停提示 */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    <div className="bg-deep-black/95 border border-amber/30 rounded px-3 py-1.5 backdrop-blur-sm">
                      <div className="font-mono text-amber text-xs">{event.year}</div>
                      <div className="font-serif text-text-primary text-xs mt-0.5">{event.nameCn}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <span className="absolute -bottom-5 text-text-tertiary/30 text-[10px] font-mono" style={{ left: '10%', transform: 'translateX(-50%)' }}>1965</span>
            <span className="absolute -bottom-5 text-text-tertiary/30 text-[10px] font-mono" style={{ left: '90%', transform: 'translateX(-50%)' }}>2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
