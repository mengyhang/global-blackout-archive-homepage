import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 1: 共情 — "如果灯灭了"
 * 灯光闪烁 → 屏幕变暗 → 统计数字涌现
 */

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { textContent: "0" },
          {
            textContent: end,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function () {
              el.textContent =
                Math.round(Number(el.textContent || 0)) + suffix;
            },
          }
        );
      },
    });
  }, [end, suffix]);

  return (
    <span ref={ref} className="stat-number">
      0{suffix}
    </span>
  );
}

export default function EmpathyScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const brightnessRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = brightnessRef.current;
    if (!container || !overlay) return;

    // 主时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
      },
    });

    // 阶段A：灯光正常，文字渐入
    tl.fromTo(
      ".empathy-phase-a",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.15 },
      0
    );

    // 阶段B：灯光闪烁 → 屏幕变暗
    tl.to(".empathy-phase-a", { opacity: 0, duration: 0.1 }, 0.2);
    tl.fromTo(
      ".empathy-phase-b",
      { opacity: 0 },
      { opacity: 1, duration: 0.05 },
      0.25
    );

    // 屏幕闪烁效果
    tl.to(overlay, { opacity: 0.3, duration: 0.02 }, 0.3);
    tl.to(overlay, { opacity: 0, duration: 0.02 }, 0.32);
    tl.to(overlay, { opacity: 0.5, duration: 0.02 }, 0.35);
    tl.to(overlay, { opacity: 0.1, duration: 0.02 }, 0.37);
    tl.to(overlay, { opacity: 0.7, duration: 0.05 }, 0.4);
    tl.to(overlay, { opacity: 0.9, duration: 0.1 }, 0.45);

    // 阶段B 文字消失
    tl.to(".empathy-phase-b", { opacity: 0, duration: 0.05 }, 0.5);

    // 阶段C：完全黑暗，统计数字渐入
    tl.to(overlay, { opacity: 0.95, duration: 0.05 }, 0.55);
    tl.fromTo(
      ".empathy-stat-1",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.1 },
      0.6
    );
    tl.fromTo(
      ".empathy-stat-2",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.1 },
      0.7
    );
    tl.fromTo(
      ".empathy-stat-3",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.1 },
      0.8
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-deep-black"
      style={{ height: "300vh" }}
    >
      <div className="h-screen w-full relative overflow-hidden">
        {/* 亮度控制遮罩 */}
        <div
          ref={brightnessRef}
          className="absolute inset-0 bg-black z-10 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* 背景灯光网格 — 模拟城市灯火 */}
        <div className="absolute inset-0 z-0">
          <CityLightsGrid />
        </div>

        {/* 阶段A: 安宁 */}
        <div className="empathy-phase-a absolute inset-0 z-20 flex items-center justify-center opacity-0">
          <p className="font-serif text-2xl md:text-4xl text-text-primary/90 text-center leading-relaxed">
            此刻，全球有
            <span className="text-amber font-bold">数十亿</span>
            盏灯在亮着
          </p>
        </div>

        {/* 阶段B: 不安 */}
        <div className="empathy-phase-b absolute inset-0 z-20 flex items-center justify-center opacity-0">
          <p className="font-serif text-3xl md:text-5xl text-text-primary text-center">
            但如果……
          </p>
        </div>

        {/* 阶段C: 统计数字 */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-12 md:gap-16">
          <div className="empathy-stat-1 text-center opacity-0">
            <p className="text-text-secondary text-sm md:text-base mb-2 tracking-wider">
              在过去
            </p>
            <CountUp end={60} suffix=" 年里" />
          </div>
          <div className="empathy-stat-2 text-center opacity-0">
            <p className="text-text-secondary text-sm md:text-base mb-2 tracking-wider">
              这样的黑暗，降临过
            </p>
            <CountUp end={13} suffix=" 次" />
          </div>
          <div className="empathy-stat-3 text-center opacity-0">
            <p className="text-text-secondary text-sm md:text-base mb-2 tracking-wider">
              影响了
            </p>
            <span className="stat-number">数十亿</span>
            <p className="text-text-secondary text-sm md:text-base mt-2 tracking-wider">
              人的生命
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 城市灯光网格背景 */
function CityLightsGrid() {
  // 用 CSS grid 模拟城市窗户灯光
  const rows = 12;
  const cols = 20;
  const windows = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.35;
      const delay = Math.random() * 2;
      windows.push(
        <div
          key={`${r}-${c}`}
          className="rounded-sm transition-opacity duration-1000"
          style={{
            backgroundColor: isLit
              ? `rgba(245, 181, 68, ${0.15 + Math.random() * 0.35})`
              : "rgba(255,255,255,0.02)",
            animationDelay: `${delay}s`,
            width: "100%",
            aspectRatio: "1.5",
          }}
        />
      );
    }
  }

  return (
    <div
      className="w-full h-full grid gap-1 p-8 md:p-16 opacity-40"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {windows}
    </div>
  );
}
