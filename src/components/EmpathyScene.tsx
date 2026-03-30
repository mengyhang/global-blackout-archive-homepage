import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Scene 1: 共情 — "如果灯灭了"
 * 优化版：更强的戏剧性和情感冲击
 */
export default function EmpathyScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overlay = container.querySelector<HTMLElement>(".brightness-overlay");
    if (!overlay) return;

    let tl: gsap.core.Timeline;

    const startAnimation = () => {
      if (tl) tl.kill();

      // 重置所有元素状态 - 确保数字完全隐藏
      gsap.set(".empathy-phase-a", { opacity: 0, y: 20 });
      gsap.set(".empathy-phase-b", { opacity: 0 });
      gsap.set(".empathy-stat-1", { opacity: 0, y: 30, scale: 0.9, visibility: "hidden" });
      gsap.set(".empathy-stat-2", { opacity: 0, y: 30, scale: 0.9, visibility: "hidden" });
      gsap.set(".empathy-stat-3", { opacity: 0, y: 30, scale: 0.9, visibility: "hidden" });
      gsap.set(".empathy-transition", { opacity: 0, y: 20, visibility: "hidden" });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(".city-light-window", { opacity: 1 });

      tl = gsap.timeline();

      tl.fromTo(".empathy-phase-a",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5 }
      );
      tl.to({}, { duration: 3 });

      tl.to(".empathy-phase-a", { opacity: 0, duration: 0.8 });
      tl.fromTo(".empathy-phase-b",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      );

      // 错落关灯效果
      tl.to(".city-light-window", {
        opacity: 0,
        duration: 0.8,
        stagger: {
          amount: 1.2,
          from: "random"
        }
      }, "+=0.5");

      tl.to(".empathy-phase-b", { opacity: 0, duration: 0.4 }, "-=0.3");
      tl.to(overlay, { opacity: 0.95, duration: 0.6 });

      // 黑暗停留（调整这个数值来控制黑暗持续时间）
      tl.to({}, { duration: 3.5 });

      tl.set(".empathy-stat-1", { visibility: "visible" });
      tl.fromTo(".empathy-stat-1",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );
      tl.to({}, { duration: 2.5 });

      tl.set(".empathy-stat-2", { visibility: "visible" });
      tl.fromTo(".empathy-stat-2",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );
      tl.to({}, { duration: 2.5 });

      tl.set(".empathy-stat-3", { visibility: "visible" });
      tl.fromTo(".empathy-stat-3",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );
      tl.to({}, { duration: 2 });

      tl.to([".empathy-stat-1", ".empathy-stat-2", ".empathy-stat-3"], {
        opacity: 0,
        duration: 0.8
      });

      tl.set(".empathy-transition", { visibility: "visible" });
      tl.fromTo(".empathy-transition",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5 }
      );
    };

    startAnimation();

    const handleSceneEnter = () => {
      startAnimation();
    };

    const handleTogglePlay = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.isPlaying) {
        tl.play();
      } else {
        tl.pause();
      }
    };

    window.addEventListener('scene-enter', handleSceneEnter);
    window.addEventListener('scene-toggle-play', handleTogglePlay);

    return () => {
      window.removeEventListener('scene-enter', handleSceneEnter);
      window.removeEventListener('scene-toggle-play', handleTogglePlay);
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-deep-black">
      <div className="empathy-inner h-full w-full relative">
        <div className="brightness-overlay absolute inset-0 bg-black z-10 pointer-events-none" style={{ opacity: 0 }} />

        <div className="absolute inset-0 z-0">
          <CityLightsGrid />
        </div>

        <div className="empathy-phase-a absolute inset-0 z-20 flex items-center justify-center opacity-0 px-6">
          <div className="text-center">
            <p className="font-serif text-3xl md:text-5xl text-gray-100 leading-relaxed">
              此刻，全球有<span className="text-amber-400 font-bold mx-2">数十亿</span>盏灯在亮着
            </p>
            <p className="font-sans text-base md:text-lg text-gray-400 mt-6 tracking-wider">
              我们习以为常，从未多想
            </p>
          </div>
        </div>

        <div className="empathy-phase-b absolute inset-0 z-20 flex items-center justify-center opacity-0">
          <p className="font-serif text-4xl md:text-6xl text-gray-100 text-center tracking-wider">
            但如果<span className="text-amber-400">……</span>
          </p>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-12 md:gap-16 px-6">
          <div className="empathy-stat-1 text-center opacity-0">
            <p className="text-gray-300 text-sm md:text-base mb-4 tracking-[0.15em]">在过去</p>
            <div className="stat-number text-7xl md:text-8xl text-amber-400 font-bold">60</div>
            <p className="text-gray-400 text-sm md:text-base mt-2 tracking-wider">年里</p>
          </div>
          <div className="empathy-stat-2 text-center opacity-0">
            <p className="text-gray-300 text-sm md:text-base mb-4 tracking-[0.15em]">这样的黑暗，降临过</p>
            <div className="stat-number text-7xl md:text-8xl text-amber-400 font-bold">13</div>
            <p className="text-gray-400 text-sm md:text-base mt-2 tracking-wider">次</p>
          </div>
          <div className="empathy-stat-3 text-center opacity-0">
            <p className="text-gray-300 text-sm md:text-base mb-4 tracking-[0.15em]">影响了</p>
            <div className="stat-number text-6xl md:text-7xl text-amber-400 font-bold">数十亿</div>
            <p className="text-gray-400 text-sm md:text-base mt-2 tracking-wider">人的生命</p>
          </div>
        </div>

        <div className="empathy-transition absolute inset-0 z-20 flex items-center justify-center opacity-0">
          <div className="text-center px-6 max-w-3xl">
            <p className="font-serif text-2xl md:text-4xl text-gray-200 leading-relaxed">
              但总有一群人，在黑暗降临之前
            </p>
            <p className="font-serif text-3xl md:text-5xl text-amber-400 leading-relaxed mt-6">
              默默守护着光明
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CityLightsGrid() {
  const rows = 14;
  const cols = 24;
  const windows = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 31 + c * 17) % 100;
      const isLit = seed > 30;
      const brightness = isLit ? 0.12 + (seed % 40) * 0.008 : 0.015;
      windows.push(
        <div
          key={`${r}-${c}`}
          className="city-light-window rounded-[1px]"
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
