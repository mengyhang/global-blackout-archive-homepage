import { useEffect, useRef } from "react";
import gsap from "gsap";
import { blackoutEvents } from "../data/blackouts";

const allEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

/**
 * 尾声场景 - 三段式升华
 * A: 时间的回响
 * B: 代际传承
 * C: 永远在路上
 */
export default function FinaleSceneV2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // ===== 场景A: 时间的回响 =====
      const sceneA = container.querySelector(".finale-scene-a") as HTMLElement;
      if (sceneA) {
        const tl = gsap.timeline({ delay: 0.5 });

        // 时间轴动画
        tl.fromTo(".timeline-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 2, ease: "power2.inOut" }
        );

        // 时间节点依次出现
        const nodes = sceneA.querySelectorAll(".timeline-node");
        nodes.forEach((node, i) => {
          tl.fromTo(node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
            `-=${i === 0 ? 0 : 0.3}`
          );
        });

        // 文字浮现
        tl.fromTo(".echo-text",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power2.out" },
          "-=0.5"
        );
      }

      // ===== 场景B: 代际传承 =====
      const sceneB = container.querySelector(".finale-scene-b") as HTMLElement;
      if (sceneB) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneB,
            start: "top center",
            toggleActions: "play none none reverse"
          }
        });

        // 三层时空融合动画
        tl.fromTo(".heritage-past",
          { opacity: 0, x: -50 },
          { opacity: 0.3, x: 0, duration: 1, ease: "power2.out" }
        );
        tl.fromTo(".heritage-present",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.7"
        );
        tl.fromTo(".heritage-future",
          { opacity: 0, x: 50 },
          { opacity: 0.2, x: 0, duration: 1, ease: "power2.out" },
          "-=0.7"
        );
      }

      // ===== 场景C: 永远在路上 =====
      const sceneC = container.querySelector(".finale-scene-c") as HTMLElement;
      if (sceneC) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneC,
            start: "top center",
            toggleActions: "play none none reverse"
          }
        });

        // 电网光点闪烁
        tl.fromTo("svg circle",
          { opacity: 0 },
          { opacity: 0.6, duration: 1.5, stagger: 0.02, ease: "power1.inOut" }
        );
      }

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-deep-black">

      {/* ===== 场景A: 时间的回响 ===== */}
      <section className="finale-scene-a relative min-h-screen w-full flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto">

          {/* 时间轴 */}
          <div className="relative mb-20">
            <div className="timeline-line absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent origin-left" />

            <div className="relative flex justify-between items-center">
              {[
                { year: 1896, label: "南洋公学" },
                { year: 1908, label: "电机专科" },
                { year: 1965, label: "第一次黑暗" },
                { year: 2003, label: "连锁崩塌" },
                { year: 2025, label: "新能源挑战" },
                { year: 2026, label: "此刻" },
                { year: "?", label: "未来" }
              ].map((node, i) => (
                <div key={i} className="timeline-node flex flex-col items-center opacity-0">
                  <div className={`w-3 h-3 rounded-full ${
                    node.year === 2026 ? "bg-amber ring-4 ring-amber/30" : "bg-amber/60"
                  }`} />
                  <div className="mt-3 text-center">
                    <div className="font-mono text-sm text-amber/80">{node.year}</div>
                    <div className="text-xs text-text-tertiary/60 mt-1 whitespace-nowrap">{node.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 文字内容 */}
          <div className="text-center space-y-8">
            <p className="echo-text font-serif text-xl md:text-3xl text-text-primary/90 leading-relaxed opacity-0">
              130年前，盛宣怀点亮第一盏灯
            </p>
            <p className="echo-text font-serif text-xl md:text-3xl text-text-primary/90 leading-relaxed opacity-0">
              118年前，中国第一个电机专科诞生
            </p>
            <p className="echo-text font-serif text-xl md:text-3xl text-text-primary/90 leading-relaxed opacity-0">
              几十年来，黑暗一次又一次降临世界某个角落
            </p>
            <p className="echo-text font-serif text-2xl md:text-4xl text-amber leading-relaxed mt-12 opacity-0">
              而每一次黑暗之后，都有一代交大人站出来，说：
            </p>
            <p className="echo-text font-serif text-3xl md:text-5xl text-amber leading-relaxed opacity-0">
              "让我们来守护光明"
            </p>
          </div>
        </div>
      </section>

      {/* ===== 场景B: 代际传承 ===== */}
      <section className="finale-scene-b relative min-h-screen w-full flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* 交大校庆徽章 */}
          <div className="mb-12 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-sjtu-red/30 bg-sjtu-red/[0.05] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-sjtu-red/60" />
            <span className="font-serif text-sm tracking-[0.2em] text-sjtu-red/80">上海交通大学 · 建校130周年</span>
            <div className="w-2 h-2 rounded-full bg-sjtu-red/60" />
          </div>

          {/* 三层时空融合 */}
          <div className="relative h-64 mb-16">
            {/* 过去 */}
            <div className="heritage-past absolute inset-0 flex items-center justify-center opacity-30">
              <div className="text-center">
                <div className="font-mono text-sm text-text-tertiary/60 mb-2">1908</div>
                <div className="text-text-secondary/70 text-sm">第一代电气人</div>
              </div>
            </div>

            {/* 现在 */}
            <div className="heritage-present absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-lg text-amber mb-3">2026</div>
                <div className="text-text-primary text-base">当代研究者</div>
              </div>
            </div>

            {/* 未来 */}
            <div className="heritage-future absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-center">
                <div className="font-mono text-sm text-text-tertiary/60 mb-2">2050+</div>
                <div className="text-text-secondary/70 text-sm">下一代守护者</div>
              </div>
            </div>
          </div>

          {/* 文字内容 */}
          <div className="space-y-6">
            <p className="font-serif text-xl md:text-3xl text-text-primary/90 leading-relaxed">
              从<span className="font-mono text-amber mx-2">1896</span>到<span className="font-mono text-amber mx-2">2026</span>
            </p>
            <p className="font-serif text-xl md:text-3xl text-text-primary/90 leading-relaxed">
              交大电气人始终站在守护光明的路上
            </p>
            <div className="mt-12 space-y-4">
              <p className="font-serif text-2xl md:text-4xl text-text-primary leading-relaxed">而此刻</p>
              <p className="font-serif text-3xl md:text-5xl text-amber leading-relaxed">
                站在这里的，是<span className="font-bold" style={{ textShadow: "0 0 30px rgba(245,158,11,0.3)" }}>我们</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 场景C: 永远在路上（核心升华） ===== */}
      <section className="finale-scene-c relative min-h-screen w-full flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* 地球视角 - 电网光点 */}
          <div className="relative h-80 mb-16 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-navy/30 to-deep-black" />

            {/* 电网光点网格 */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
              {Array.from({ length: 50 }, (_, i) => {
                const x = (i * 37) % 100;
                const y = (i * 53) % 100;
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="1.5"
                    fill="#F59E0B"
                    opacity={0.3 + (i % 5) * 0.1}
                  />
                );
              })}
            </svg>

            {/* 未知区域 */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-2 border-dashed border-amber/30 flex items-center justify-center">
              <span className="text-amber/50 text-2xl">?</span>
            </div>

            {/* 从交大射出的光束 */}
            <div className="absolute bottom-1/3 left-1/2 w-1 h-32 bg-gradient-to-t from-amber via-amber/50 to-transparent transform -translate-x-1/2 rotate-12" />
          </div>

          {/* 核心文字 */}
          <div className="space-y-8">
            <p className="font-serif text-xl md:text-2xl text-text-primary/80 leading-relaxed">
              2026年，当我们站在130周年的节点回望
            </p>

            <div className="space-y-4">
              <p className="font-serif text-lg md:text-xl text-text-secondary/70">我们看到了60年13次黑暗</p>
              <p className="font-serif text-lg md:text-xl text-text-secondary/70">我们看到了130年不灭的光</p>
            </div>

            <p className="font-serif text-2xl md:text-3xl text-amber leading-relaxed mt-8">
              但我们更看到——
            </p>
            <p className="font-serif text-3xl md:text-4xl text-amber font-bold leading-relaxed">
              故事还没有结束
            </p>

            <div className="mt-12 space-y-4 text-text-secondary/60 text-base md:text-lg">
              <p>下一次黑暗，可能来自极端气候</p>
              <p>可能来自网络攻击</p>
              <p>可能来自我们尚未预见的威胁</p>
            </div>

            <div className="mt-16 space-y-6">
              <p className="font-serif text-2xl md:text-3xl text-text-primary leading-relaxed">
                而交大电气人的使命，不是等待光明
              </p>
              <p className="font-serif text-3xl md:text-5xl text-amber font-bold leading-relaxed">
                而是永远走在黑暗之前
              </p>
            </div>

            {/* 最终标语 */}
            <div className="mt-20 pt-12 border-t border-white/10">
              <div className="space-y-4">
                <p className="font-serif text-2xl md:text-3xl text-amber leading-relaxed">
                  守护光明，不是终点
                </p>
                <p className="font-serif text-3xl md:text-4xl text-amber font-bold leading-relaxed">
                  引领未来，才是使命
                </p>
              </div>
              <div className="mt-8 text-text-tertiary/50 text-sm tracking-wider">
                上海交通大学电气工程学院
              </div>
              <div className="mt-2 font-mono text-amber/60 text-lg tracking-widest">
                1896 — 2026 — ∞
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.04] py-16 px-6 bg-deep-black">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <p className="font-serif text-text-secondary/60 text-sm tracking-[0.08em]">
            电力系统安全分析课程 · 上海交通大学电气工程学院
          </p>
          <p className="text-text-tertiary/40 text-xs tracking-wider">
            献礼上海交通大学建校130周年
          </p>
          <div className="pt-8">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-text-tertiary/20 to-transparent mx-auto mb-6" />
            <div className="flex items-center justify-center gap-5 text-text-tertiary/25 text-[11px] tracking-wider">
              <span>铭记黑暗，守护光明</span>
              <span className="w-px h-3 bg-text-tertiary/10" />
              <span className="font-display">Light fades. Memory endures.</span>
            </div>
          </div>
          <p className="text-text-tertiary/15 text-[10px] pt-6 tracking-wider">
            &copy; 2026 Global Blackout Archive
          </p>
        </div>
      </footer>

    </div>
  );
}
