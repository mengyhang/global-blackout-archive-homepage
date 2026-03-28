import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventCard from "./EventCard";
import { blackoutEvents, type ActInfo } from "../data/blackouts";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  actInfo: ActInfo;
}

/**
 * 单幕组件 — 全屏 pin + scrub
 *
 * 时间线比例（基于 1.0）：
 *   0.00 - 0.25  入场：标题 + 卡片依次淡入
 *   0.25 - 0.60  停留：内容完全可见
 *   0.55 - 0.70  暗线：交大信息渐入
 *   0.75 - 0.95  退场：整体淡出
 *
 * 所有动画 scrub 驱动，回滚自然反向。
 */
export default function ActSection({ actInfo }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const events = blackoutEvents.filter((e) => e.act === actInfo.act);
  const isFinale = actInfo.act === 5;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const content = section.querySelector(".act-content") as HTMLElement;
      if (!content) return;

      // 卡片越多，给越多滚动距离，让内容有充分展示时间
      const cards = content.querySelectorAll(".card-item");
      const cardCount = cards.length;
      const scrollDistance = cardCount <= 2 ? 300 : cardCount === 3 ? 380 : 420;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}%`,
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          refreshPriority: 70 - actInfo.act * 5, // Act1=65, Act2=60, Act3=55, Act4=50, Act5=45
        },
      });

      // ---- 入场 (0 - 0.20) ----
      tl.fromTo(content.querySelector(".act-number"),
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.05 },
        0.02
      );
      tl.fromTo(content.querySelector(".act-heading"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.06, ease: "power3.out" },
        0.05
      );

      // 卡片依次入场，间隔根据数量自适应
      const cardStaggerStart = 0.10;
      const cardStaggerSpan = 0.02 + cardCount * 0.025; // 2卡=0.07, 3卡=0.095, 4卡=0.12
      cards.forEach((card, i) => {
        tl.fromTo(card,
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power2.out" },
          cardStaggerStart + i * (cardStaggerSpan / Math.max(cardCount, 1))
        );
      });

      // ---- 停留 (0.22 - 0.60): 内容完全可见 ----

      // ---- 暗线 (0.60 - 0.72) ----
      const sjtuLine = content.querySelector(".sjtu-line");
      const sjtuText = content.querySelector(".sjtu-text");
      if (sjtuLine) {
        tl.fromTo(sjtuLine, { scaleX: 0 }, { scaleX: 1, duration: 0.06, ease: "power2.inOut" }, 0.60);
      }
      if (sjtuText) {
        tl.fromTo(sjtuText, { opacity: 0, y: 8 }, { opacity: 0.6, y: 0, duration: 0.05 }, 0.65);
      }

      // ---- 光线扫过 + 退场 (0.76 - 0.95) ----
      const sweep = content.querySelector(".light-sweep");
      const sweepBar = sweep?.querySelector("div");
      if (sweep && sweepBar) {
        tl.to(sweep, { opacity: 1, duration: 0.02 }, 0.76);
        tl.fromTo(sweepBar, { x: "-100%" }, { x: "300%", duration: 0.12, ease: "power2.inOut" }, 0.76);
        tl.to(sweep, { opacity: 0, duration: 0.02 }, 0.90);
      }
      tl.to(content, { opacity: 0, y: -20, duration: 0.12, ease: "power2.in" }, 0.82);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-clip bg-deep-black"
    >
      <ActBackground act={actInfo.act} />

      <div className="act-content h-full w-full flex flex-col items-center justify-center px-6 py-12 md:py-16 relative">
        {/* 光线扫过效果（退场时触发） */}
        <div className="light-sweep absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0">
          <div className="absolute inset-y-0 w-1/3"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.06), transparent)",
              transform: "translateX(-100%)",
            }} />
        </div>
        {/* 幕序号 */}
        <div className="act-number relative z-10 flex items-center gap-4 mb-6 opacity-0 origin-center">
          <div className="h-px w-8 bg-amber/30" />
          <span className="font-mono text-[11px] text-amber/40 tracking-[0.4em] uppercase">Act {actInfo.act}</span>
          <div className="h-px w-8 bg-amber/30" />
        </div>

        {/* 标题 */}
        <div className="act-heading text-center mb-10 md:mb-14 relative z-10 opacity-0">
          <h2 className="act-title">{actInfo.title}</h2>
          <p className="font-display text-text-tertiary/60 text-sm md:text-base mt-3 tracking-[0.12em]">{actInfo.subtitle}</p>
          <p className={`mt-4 max-w-md mx-auto leading-relaxed ${isFinale ? "text-text-secondary/40 text-sm font-serif" : "text-text-secondary/30 text-xs"}`}>
            {actInfo.theme}
          </p>
        </div>

        {/* 卡片 */}
        <div className={`cards-grid relative z-10 w-full max-w-6xl mx-auto grid gap-4 md:gap-5 ${
          isFinale ? "grid-cols-1 max-w-2xl"
            : events.length <= 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl"
            : events.length <= 3 ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} className={`card-item ${isFinale ? "p-6 md:p-8" : ""}`} />
          ))}
        </div>

        {/* 暗线 */}
        {!isFinale && (
          <div className="relative z-10 mt-10 md:mt-14 w-full max-w-xl mx-auto text-center">
            <div className="sjtu-line h-px mx-auto origin-center"
              style={{ background: "linear-gradient(90deg, transparent, #9E1A2F, transparent)", maxWidth: "160px" }} />
            <p className="sjtu-text sjtu-whisper mt-4 font-serif text-[13px] opacity-0">{actInfo.sjtuWhisper}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** 每幕背景氛围 */
function ActBackground({ act }: { act: number }) {
  const base = "absolute inset-0 overflow-hidden pointer-events-none";
  switch (act) {
    case 1:
      return (
        <div className={base}>
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-deep-navy/30 to-transparent" />
          {Array.from({ length: 25 }, (_, i) => {
            const s = (i * 37 + 13) % 100;
            return <div key={i} className="absolute rounded-full" style={{
              width: `${2 + (s % 3)}px`, height: `${2 + (s % 3)}px`,
              left: `${(s * 7 + i * 11) % 100}%`, bottom: `${5 + (s * 3) % 30}%`,
              backgroundColor: `rgba(245, 181, 68, ${0.06 + (s % 20) * 0.006})`,
            }} />;
          })}
        </div>
      );
    case 2:
      return (
        <div className={base}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-[0.025] blur-[100px]"
            style={{ background: "radial-gradient(ellipse, #06B6D4, #3B82F6, transparent)" }} />
          <div className="absolute top-1/3 right-1/4 w-1/3 h-2/5 rounded-full opacity-[0.015] blur-[80px]"
            style={{ background: "radial-gradient(ellipse, #10B981, #06B6D4, transparent)" }} />
        </div>
      );
    case 3:
      return (
        <div className={base}>
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            {Array.from({ length: 12 }, (_, i) => {
              const s = (i * 47 + 7) % 100;
              return <line key={i} x1={`${(s*3)%100}%`} y1={`${(s*7)%100}%`}
                x2={`${(s*3+20)%100}%`} y2={`${(s*7+15)%100}%`} stroke="#3B82F6" strokeWidth="0.5" />;
            })}
            {Array.from({ length: 16 }, (_, i) => {
              const s = (i * 29 + 3) % 100;
              return <circle key={`n${i}`} cx={`${(s*5)%100}%`} cy={`${(s*3+10)%100}%`}
                r="1.5" fill="#3B82F6" opacity={0.2 + (s%30)*0.01} />;
            })}
          </svg>
        </div>
      );
    case 4:
      return (
        <div className={base}>
          <div className="absolute inset-0 opacity-[0.02]">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="absolute font-mono text-[10px] leading-none whitespace-nowrap text-green-500/50"
                style={{ left: `${i*16}%`, top: `${(i*23+10)%60}%` }}>
                {Array.from({ length: 50 }, (_, j) => ((i*7+j)%2).toString()).join("")}
              </div>
            ))}
          </div>
          <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 rounded-full opacity-[0.015] blur-[80px]"
            style={{ background: "radial-gradient(ellipse, #38BDF8, transparent)" }} />
        </div>
      );
    case 5:
      return (
        <div className={base}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-2/3 opacity-[0.04] blur-[100px]"
            style={{ background: "radial-gradient(ellipse at bottom center, #F59E0B, transparent 70%)" }} />
        </div>
      );
    default:
      return null;
  }
}
