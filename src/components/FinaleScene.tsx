import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blackoutEvents } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

const allEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

/**
 * Scene 8: 尾声 — 回到光明
 *
 * 三个全屏 pin 场景 + Footer
 * 时间线统一使用 scrub，回滚自然反向
 *
 * 每幕比例：入场 0-0.2 | 停留 0.2-0.7 | 退场 0.75-0.95
 */
export default function FinaleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {

      // ===== 阶段A: 光的回归 =====
      const sA = container.querySelector(".finale-a") as HTMLElement;
      if (sA) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sA, start: "top top", end: "+=200%", scrub: 1.5, pin: true, pinSpacing: true, refreshPriority: 30 },
        });
        tl.fromTo(sA.querySelector(".fl-top"), { scaleX: 0 }, { scaleX: 1, duration: 0.06 }, 0.02);
        tl.fromTo(sA.querySelector(".ft-1a"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.06);
        tl.fromTo(sA.querySelector(".ft-1b"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.12);
        tl.fromTo(sA.querySelector(".fl-bot"), { scaleX: 0 }, { scaleX: 1, duration: 0.06 }, 0.18);
        // 停留 0.25 - 0.70
        tl.to(sA.querySelector(".fa-content"), { opacity: 0, y: -20, duration: 0.15 }, 0.80);
      }

      // ===== 阶段B: 交大与传承 =====
      const sB = container.querySelector(".finale-b") as HTMLElement;
      if (sB) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sB,
            start: "top top",
            end: "+=250%",
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            refreshPriority: 20,
            onUpdate: (self) => {
              if (self.progress > 0.35 && self.progress < 0.75) {
                const usEl = sB.querySelector(".fb-us2");
                if (usEl) {
                  const rect = usEl.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent("ambient-scene", {
                    detail: {
                      converge: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
                      brightness: 0.9,
                      targetCount: 50,
                    },
                  }));
                }
              } else {
                window.dispatchEvent(new CustomEvent("ambient-scene", {
                  detail: { converge: null },
                }));
              }
            },
          },
        });
        tl.fromTo(sB.querySelector(".fb-badge"),
          { opacity: 0, scale: 0.92, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.10 },
          0.02
        );
        const texts = sB.querySelectorAll(".fb-text");
        texts.forEach((el, i) => {
          tl.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.07 }, 0.08 + i * 0.05);
        });
        tl.fromTo(sB.querySelector(".fb-us1"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.07 }, 0.30);
        tl.fromTo(sB.querySelector(".fb-us2"), { opacity: 0, y: 12, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.08 }, 0.36);
        // 停留 0.42 - 0.70
        tl.to(sB.querySelector(".fb-content"), { opacity: 0, y: -20, duration: 0.15 }, 0.80);
      }

      // ===== 阶段C: 档案入口 =====
      const sC = container.querySelector(".finale-c") as HTMLElement;
      if (sC) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sC, start: "top top", end: "+=180%", scrub: 1.5, pin: true, pinSpacing: true, refreshPriority: 10 },
        });
        tl.fromTo(sC.querySelector(".fc-title"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06 }, 0.02);
        const cards = sC.querySelectorAll(".archive-card");
        cards.forEach((card, i) => {
          tl.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.04 }, 0.06 + i * 0.012);
        });
        // 档案页不做退场 — 自然接 footer
      }

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-deep-black">

      {/* ===== A: 光的回归 ===== */}
      <section className="finale-a relative h-screen w-full overflow-hidden bg-deep-black">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 70%, rgba(245,158,11,0.04) 0%, transparent 55%)" }} />
        <div className="fa-content h-full w-full flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            <div className="fl-top w-16 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent mx-auto mb-10 origin-center" />
            <p className="ft-1a font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary/90 leading-[1.6] opacity-0">
              每一次<span className="text-amber">黑暗</span>
            </p>
            <p className="ft-1b font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary/90 leading-[1.6] mt-1 opacity-0">
              都让我们更懂得<span className="text-amber">光明</span>的意义
            </p>
            <div className="fl-bot w-16 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent mx-auto mt-10 origin-center" />
          </div>
        </div>
      </section>

      {/* ===== B: 交大与传承 ===== */}
      <section className="finale-b relative h-screen w-full overflow-hidden bg-deep-black">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(158,26,47,0.03) 0%, transparent 50%)" }} />
        <div className="fb-content h-full w-full flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            <div className="fb-badge mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-sjtu-red/30 bg-sjtu-red/[0.03] opacity-0">
              <div className="w-1.5 h-1.5 rounded-full bg-sjtu-red/60" />
              <span className="font-serif text-sm tracking-[0.2em] text-sjtu-red/80">上海交通大学 · 建校130周年</span>
              <div className="w-1.5 h-1.5 rounded-full bg-sjtu-red/60" />
            </div>
            <div className="space-y-2">
              <p className="fb-text font-serif text-xl md:text-2xl lg:text-3xl text-text-primary/80 leading-relaxed opacity-0">
                从<span className="font-mono text-amber mx-1">1896</span>到<span className="font-mono text-amber mx-1">2026</span>
              </p>
              <p className="fb-text font-serif text-xl md:text-2xl lg:text-3xl text-text-primary/80 leading-relaxed opacity-0">
                交大电气人始终站在守护光明的路上
              </p>
            </div>
            <div className="mt-16 space-y-3">
              <p className="fb-us1 font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary/90 leading-relaxed opacity-0">而此刻</p>
              <p className="fb-us2 font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary leading-relaxed opacity-0">
                站在这里的，是<span className="text-amber font-bold" style={{ textShadow: "0 0 30px rgba(245,158,11,0.2)" }}>我们</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== C: 档案入口 ===== */}
      <section className="finale-c relative h-screen w-full overflow-hidden bg-deep-black">
        <div className="h-full w-full flex flex-col items-center justify-center px-6">
          <div className="fc-title text-center mb-10 opacity-0">
            <div className="w-10 h-px bg-gradient-to-r from-transparent via-text-tertiary/30 to-transparent mx-auto mb-6" />
            <p className="font-serif text-base md:text-lg text-text-secondary/50 tracking-[0.12em]">翻开档案，铭记每一段黑暗</p>
          </div>
          <div className="archive-grid w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {allEvents.map((event) => (
              <a key={event.id} href={`/events/${event.slug}`}
                className="archive-card group relative overflow-hidden rounded-lg bg-deep-surface/50 border border-white/[0.03] p-4 md:p-5 hover:border-amber/20 transition-all duration-300 opacity-0">
                <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/[0.03] transition-colors duration-300" />
                <div className="relative z-10">
                  <span className="font-mono text-amber/50 text-xs tracking-wider">{event.year}</span>
                  <h3 className="font-serif text-text-primary/90 text-sm mt-2 group-hover:text-amber transition-colors duration-300 leading-snug">{event.nameCn}</h3>
                  <p className="text-text-tertiary/50 text-xs mt-2 line-clamp-1">{event.location}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.04] py-16 md:py-20 px-6 bg-deep-black">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <p className="font-serif text-text-secondary/60 text-sm tracking-[0.08em]">电力系统安全分析课程 · 上海交通大学电气工程学院</p>
          <p className="text-text-tertiary/40 text-xs tracking-wider">献礼上海交通大学建校130周年</p>
          <div className="pt-8">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-text-tertiary/20 to-transparent mx-auto mb-6" />
            <div className="flex items-center justify-center gap-5 text-text-tertiary/25 text-[11px] tracking-wider">
              <span>铭记黑暗，守护光明</span>
              <span className="w-px h-3 bg-text-tertiary/10" />
              <span className="font-display">Light fades. Memory endures.</span>
            </div>
          </div>
          <p className="text-text-tertiary/15 text-[10px] pt-6 tracking-wider">&copy; 2026 Global Blackout Archive</p>
        </div>
      </footer>
    </div>
  );
}
