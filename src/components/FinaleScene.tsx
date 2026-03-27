import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blackoutEvents } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

const allEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

/**
 * Scene 8: 尾声 — 回到光明
 * 叙事高潮与收束：从黑暗回到光明，从历史回到当下
 */
export default function FinaleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 背景暖光渐入
      gsap.fromTo(".finale-glow", { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: { trigger: container, start: "top 50%", end: "+=400", scrub: 1 },
      });

      // 第一段
      gsap.fromTo(".finale-text-1", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: ".finale-text-1", start: "top 75%", toggleActions: "play none none reverse" },
      });

      // 交大部分 — 依次渐入
      gsap.fromTo(".finale-badge", { opacity: 0, scale: 0.9 }, {
        opacity: 1, scale: 1, duration: 0.8,
        scrollTrigger: { trigger: ".finale-sjtu", start: "top 70%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(".finale-sjtu-text", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2,
        scrollTrigger: { trigger: ".finale-sjtu", start: "top 65%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(".finale-us", { opacity: 0, y: 20, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 1,
        scrollTrigger: { trigger: ".finale-us", start: "top 75%", toggleActions: "play none none reverse" },
      });

      // 档案网格
      gsap.fromTo(".archive-card", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.06,
        scrollTrigger: { trigger: ".archive-grid", start: "top 80%", toggleActions: "play none none reverse" },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-deep-black">
      {/* 背景暖光 */}
      <div
        className="finale-glow fixed inset-0 pointer-events-none opacity-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.05) 0%, transparent 55%)",
        }}
      />

      {/* 阶段A: 光的回归 */}
      <section className="scene-fade-in relative min-h-screen flex items-center justify-center px-6">
        <div className="finale-text-1 text-center max-w-3xl">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent mx-auto mb-10" />
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary/90 leading-[1.6]">
            每一次<span className="text-amber">黑暗</span>
          </p>
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary/90 leading-[1.6] mt-1">
            都让我们更懂得<span className="text-amber">光明</span>的意义
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent mx-auto mt-10" />
        </div>
      </section>

      {/* 阶段B: 交大与传承 */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="finale-sjtu text-center max-w-3xl">
          {/* 校庆徽章 */}
          <div className="finale-badge mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-sjtu-red/30 bg-sjtu-red/[0.03]">
            <div className="w-1.5 h-1.5 rounded-full bg-sjtu-red/60" />
            <span className="font-serif text-[13px] tracking-[0.25em] text-sjtu-red/80">
              上海交通大学 · 建校130周年
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-sjtu-red/60" />
          </div>

          <div className="space-y-2">
            <p className="finale-sjtu-text font-serif text-xl md:text-2xl lg:text-3xl text-text-primary/70 leading-relaxed">
              从<span className="font-mono text-amber mx-1">1896</span>到<span className="font-mono text-amber mx-1">2026</span>
            </p>
            <p className="finale-sjtu-text font-serif text-xl md:text-2xl lg:text-3xl text-text-primary/70 leading-relaxed">
              交大电气人始终站在守护光明的路上
            </p>
          </div>

          <div className="finale-us mt-16 space-y-3">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary/90 leading-relaxed">
              而此刻
            </p>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary leading-relaxed">
              站在这里的，是<span className="text-amber font-bold" style={{ textShadow: "0 0 30px rgba(245,158,11,0.2)" }}>我们</span>
            </p>
          </div>
        </div>
      </section>

      {/* 阶段C: 档案入口 */}
      <section className="scene-fade-in relative py-28 md:py-36 px-6">
        <div className="text-center mb-16">
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-text-tertiary/30 to-transparent mx-auto mb-6" />
          <p className="font-serif text-base md:text-lg text-text-secondary/50 tracking-[0.12em]">
            翻开档案，铭记每一段黑暗
          </p>
        </div>

        <div className="archive-grid max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {allEvents.map((event) => (
            <a
              key={event.id}
              href={`/events/${event.slug}`}
              className="archive-card group relative overflow-hidden rounded-lg bg-deep-surface/50 border border-white/[0.03] p-4 md:p-5 hover:border-amber/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/[0.03] transition-colors duration-300" />
              <div className="relative z-10">
                <span className="font-mono text-amber/40 text-[10px] tracking-wider">{event.year}</span>
                <h3 className="font-serif text-text-primary/80 text-sm mt-2 group-hover:text-amber/90 transition-colors duration-300 leading-snug">
                  {event.nameCn}
                </h3>
                <p className="text-text-tertiary/40 text-[10px] mt-2 line-clamp-1">{event.location}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.04] py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <p className="font-serif text-text-secondary/60 text-sm tracking-[0.08em]">
            电力系统安全分析课程 · 上海交通大学电气工程系
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
