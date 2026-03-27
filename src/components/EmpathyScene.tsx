import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 1: 共情 — "如果灯灭了"
 * 城市灯火 → 闪烁不安 → 屏幕变暗 → 统计数字涌现 → 淡出
 *
 * 修复：context 作用域 + pin 结束时整体淡出
 */
export default function EmpathyScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overlay = container.querySelector<HTMLElement>(".brightness-overlay");
    const innerEl = container.querySelector<HTMLElement>(".empathy-inner");
    if (!overlay || !innerEl) return;

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=300%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      // ---- 阶段A (0-0.2): 灯光安宁，文字淡入 ----
      tl.fromTo(".empathy-phase-a", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.02);

      // ---- 阶段B (0.2-0.45): 不安 → 闪烁 → 黑暗 ----
      tl.to(".empathy-phase-a", { opacity: 0, duration: 0.06 }, 0.18);
      tl.fromTo(".empathy-phase-b", { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.22);

      // 城市灯光闪烁 — 通过 overlay 控制
      tl.to(overlay, { opacity: 0.2, duration: 0.015 }, 0.28);
      tl.to(overlay, { opacity: 0, duration: 0.015 }, 0.295);
      tl.to(overlay, { opacity: 0.4, duration: 0.015 }, 0.32);
      tl.to(overlay, { opacity: 0.05, duration: 0.015 }, 0.335);
      tl.to(overlay, { opacity: 0.6, duration: 0.02 }, 0.36);
      tl.to(overlay, { opacity: 0.85, duration: 0.06 }, 0.4);

      tl.to(".empathy-phase-b", { opacity: 0, duration: 0.04 }, 0.42);

      // ---- 阶段C (0.45-0.8): 黑暗中统计数字渐入 ----
      tl.to(overlay, { opacity: 0.93, duration: 0.03 }, 0.45);

      tl.fromTo(".empathy-stat-1", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.08 }, 0.5);
      tl.fromTo(".empathy-stat-2", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.08 }, 0.6);
      tl.fromTo(".empathy-stat-3", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.08 }, 0.7);

      // ---- 退场 (0.85-1.0): 整体淡出 ----
      tl.to(".empathy-stat-1, .empathy-stat-2, .empathy-stat-3", {
        opacity: 0, y: -15, duration: 0.12, stagger: 0.02,
      }, 0.85);
      tl.to(overlay, { opacity: 1, duration: 0.1 }, 0.9);
    }, container);

    return () => gsapCtx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-deep-black">
      <div className="empathy-inner h-full w-full relative">
        {/* 亮度遮罩 */}
        <div className="brightness-overlay absolute inset-0 bg-black z-10 pointer-events-none" style={{ opacity: 0 }} />

        {/* 城市灯火背景 */}
        <div className="absolute inset-0 z-0">
          <CityLightsGrid />
        </div>

        {/* 阶段A: 安宁 */}
        <div className="empathy-phase-a absolute inset-0 z-20 flex items-center justify-center opacity-0 px-6">
          <div className="text-center">
            <p className="font-serif text-2xl md:text-4xl text-text-primary/90 leading-relaxed">
              此刻，全球有
              <span className="text-amber font-bold mx-1">数十亿</span>
              盏灯在亮着
            </p>
            <p className="font-sans text-sm text-text-tertiary/50 mt-4 tracking-wider">
              我们习以为常，从未多想
            </p>
          </div>
        </div>

        {/* 阶段B: 不安 */}
        <div className="empathy-phase-b absolute inset-0 z-20 flex items-center justify-center opacity-0">
          <p className="font-serif text-3xl md:text-5xl text-text-primary text-center tracking-wider">
            但如果<span className="text-amber">……</span>
          </p>
        </div>

        {/* 阶段C: 黑暗中的数字 */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 md:gap-14 px-6">
          <div className="empathy-stat-1 text-center opacity-0">
            <p className="text-text-secondary/60 text-xs md:text-sm mb-3 tracking-[0.15em]">
              在过去
            </p>
            <div className="stat-number">60</div>
            <p className="text-text-secondary/40 text-xs mt-1 tracking-wider">年里</p>
          </div>
          <div className="empathy-stat-2 text-center opacity-0">
            <p className="text-text-secondary/60 text-xs md:text-sm mb-3 tracking-[0.15em]">
              这样的黑暗，降临过
            </p>
            <div className="stat-number">13</div>
            <p className="text-text-secondary/40 text-xs mt-1 tracking-wider">次</p>
          </div>
          <div className="empathy-stat-3 text-center opacity-0">
            <p className="text-text-secondary/60 text-xs md:text-sm mb-3 tracking-[0.15em]">
              影响了
            </p>
            <div className="font-mono text-4xl md:text-6xl font-bold text-amber" style={{ textShadow: "0 0 40px rgba(245,158,11,0.25)" }}>
              数十亿
            </div>
            <p className="text-text-secondary/40 text-xs mt-1 tracking-wider">人的生命</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 城市灯光网格 — 用固定种子避免 hydration 不匹配 */
function CityLightsGrid() {
  const rows = 14;
  const cols = 24;

  // 使用固定模式而非随机，避免 SSR/CSR 不一致
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 31 + c * 17) % 100;
      const isLit = seed > 30;
      const brightness = isLit ? 0.12 + (seed % 40) * 0.008 : 0.015;
      windows.push(
        <div
          key={`${r}-${c}`}
          className="rounded-[1px]"
          style={{
            backgroundColor: `rgba(245, 181, 68, ${brightness})`,
            width: "100%",
            aspectRatio: "1.6",
          }}
        />
      );
    }
  }

  return (
    <div
      className="w-full h-full grid gap-[2px] p-6 md:p-12 opacity-50"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {windows}
    </div>
  );
}
