import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blackoutEvents } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

// 按时间排序
const allEvents = [...blackoutEvents].sort((a, b) => a.year - b.year);

/**
 * Scene 8: 尾声 — 回到光明
 * 光的回归 → 交大与传承 → 13事件档案入口 → Footer
 */
export default function FinaleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 背景从深黑变暖
      gsap.fromTo(
        ".finale-glow",
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: container,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // 第一段文字
      gsap.fromTo(
        ".finale-text-1",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".finale-text-1",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 交大部分
      gsap.fromTo(
        ".finale-sjtu",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ".finale-sjtu",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 档案网格
      gsap.fromTo(
        ".archive-card",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".archive-grid",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-deep-black">
      {/* 背景暖光 */}
      <div
        className="finale-glow fixed inset-0 pointer-events-none opacity-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(245,158,11,0.06) 0%, transparent 60%)",
        }}
      />

      {/* 阶段A：光的回归 */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="finale-text-1 text-center max-w-3xl">
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed">
            每一次<span className="text-amber">黑暗</span>
          </p>
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed mt-2">
            都让我们更懂得<span className="text-amber">光明</span>的意义
          </p>
        </div>
      </section>

      {/* 阶段B：交大与传承 */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="finale-sjtu text-center max-w-3xl">
          {/* 130周年标识 */}
          <div className="mb-10">
            <div
              className="inline-block px-6 py-2 rounded-full border"
              style={{ borderColor: "#9E1A2F" }}
            >
              <span
                className="font-serif text-sm tracking-[0.2em]"
                style={{ color: "#9E1A2F" }}
              >
                上海交通大学 · 130周年
              </span>
            </div>
          </div>

          <p className="font-serif text-xl md:text-3xl text-text-primary/80 leading-loose">
            从<span className="font-mono text-amber">1896</span>到
            <span className="font-mono text-amber">2026</span>
          </p>
          <p className="font-serif text-xl md:text-3xl text-text-primary/80 leading-loose mt-1">
            交大电气人始终站在守护光明的路上
          </p>

          <div className="mt-12 space-y-2">
            <p className="font-serif text-2xl md:text-4xl text-text-primary leading-relaxed">
              而此刻
            </p>
            <p className="font-serif text-2xl md:text-4xl text-text-primary leading-relaxed">
              站在这里的，是
              <span className="text-amber font-bold">我们</span>
            </p>
          </div>
        </div>
      </section>

      {/* 阶段C：档案入口 */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="text-center mb-16">
          <p className="font-serif text-lg md:text-xl text-text-secondary tracking-wider">
            翻开档案，铭记每一段黑暗
          </p>
        </div>

        <div className="archive-grid max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allEvents.map((event) => (
            <a
              key={event.id}
              href={`/events/${event.slug}`}
              className="archive-card group relative overflow-hidden rounded-lg bg-deep-surface border border-white/5 p-5 hover:border-amber/30 transition-all duration-300"
            >
              {/* 悬停时的光效 */}
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/5 transition-colors duration-300" />

              <div className="relative z-10">
                <span className="font-mono text-amber/60 text-xs">
                  {event.year}
                </span>
                <h3 className="font-serif text-text-primary text-sm md:text-base mt-2 group-hover:text-amber transition-colors">
                  {event.nameCn}
                </h3>
                <p className="text-text-tertiary text-xs mt-2 line-clamp-1">
                  {event.location}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="font-serif text-text-secondary text-sm">
            电力系统安全分析课程 · 上海交通大学电气工程系
          </p>
          <p className="text-text-tertiary text-xs">
            献礼上海交通大学建校130周年
          </p>
          <div className="pt-6 flex items-center justify-center gap-6 text-text-tertiary/40 text-xs">
            <span>铭记黑暗，守护光明</span>
            <span className="text-text-tertiary/20">|</span>
            <span>Light fades. Memory endures.</span>
          </div>
          <p className="text-text-tertiary/30 text-xs pt-4">
            &copy; 2026 Global Blackout Archive. Open Source Project.
          </p>
        </div>
      </footer>
    </div>
  );
}
