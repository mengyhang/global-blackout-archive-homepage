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
 * 单幕组件 — 标题 + 事件卡片 + 幕间暗线
 * 每幕有独特的背景氛围
 */
export default function ActSection({ actInfo }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const events = blackoutEvents.filter((e) => e.act === actInfo.act);
  const isFinale = actInfo.act === 5;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 幕序号 + 标题
      gsap.fromTo(
        section.querySelector(".act-number"),
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        section.querySelector(".act-heading"),
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );

      // 卡片错开
      gsap.fromTo(
        section.querySelectorAll(".card-item"),
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section.querySelector(".cards-grid"),
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 暗线
      const sjtuLine = section.querySelector(".sjtu-line");
      const sjtuText = section.querySelector(".sjtu-text");
      if (sjtuLine && sjtuText) {
        gsap.fromTo(sjtuLine, { scaleX: 0 }, {
          scaleX: 1, duration: 0.8, ease: "power2.inOut",
          scrollTrigger: { trigger: sjtuLine, start: "top 88%", toggleActions: "play none none reverse" },
        });
        gsap.fromTo(sjtuText, { opacity: 0, y: 8 }, {
          opacity: 0.6, y: 0, duration: 0.6, delay: 0.3,
          scrollTrigger: { trigger: sjtuText, start: "top 88%", toggleActions: "play none none reverse" },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`scene-fade-in relative w-full flex flex-col items-center justify-center px-6 ${
        isFinale ? "min-h-screen py-32 md:py-40" : "min-h-screen py-24 md:py-32"
      }`}
    >
      <ActBackground act={actInfo.act} />

      {/* 幕序号装饰线 */}
      <div className="act-number relative z-10 flex items-center gap-4 mb-8 opacity-0 origin-center">
        <div className="h-px w-8 bg-amber/30" />
        <span className="font-mono text-[11px] text-amber/40 tracking-[0.4em] uppercase">
          Act {actInfo.act}
        </span>
        <div className="h-px w-8 bg-amber/30" />
      </div>

      {/* 幕标题 */}
      <div className="act-heading text-center mb-16 md:mb-20 relative z-10 opacity-0">
        <h2 className="act-title">{actInfo.title}</h2>
        <p className="font-display text-text-tertiary/60 text-sm md:text-base mt-3 tracking-[0.12em]">
          {actInfo.subtitle}
        </p>
        {!isFinale && (
          <p className="text-text-secondary/30 text-xs mt-5 max-w-sm mx-auto leading-relaxed">
            {actInfo.theme}
          </p>
        )}
        {isFinale && (
          <p className="text-text-secondary/40 text-sm mt-6 max-w-md mx-auto leading-relaxed font-serif">
            {actInfo.theme}
          </p>
        )}
      </div>

      {/* 卡片网格 */}
      <div
        className={`cards-grid relative z-10 w-full max-w-6xl mx-auto grid gap-5 md:gap-6 ${
          isFinale
            ? "grid-cols-1 max-w-2xl"
            : events.length <= 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl"
              : events.length <= 3
                ? "grid-cols-1 md:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} className={`card-item ${isFinale ? "p-8 md:p-10" : ""}`} />
        ))}
      </div>

      {/* 幕间暗线（第五幕不显示，由尾声接管） */}
      {!isFinale && (
        <div className="relative z-10 mt-24 md:mt-32 w-full max-w-xl mx-auto text-center">
          <div
            className="sjtu-line h-px mx-auto origin-center"
            style={{
              background: "linear-gradient(90deg, transparent, #9E1A2F, transparent)",
              maxWidth: "160px",
            }}
          />
          <p className="sjtu-text sjtu-whisper mt-5 font-serif text-[13px]">
            {actInfo.sjtuWhisper}
          </p>
        </div>
      )}
    </section>
  );
}

/** 每幕独特的背景氛围 */
function ActBackground({ act }: { act: number }) {
  const base = "absolute inset-0 overflow-hidden pointer-events-none";

  switch (act) {
    case 1:
      return (
        <div className={base}>
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-deep-navy/30 to-transparent" />
          {Array.from({ length: 25 }, (_, i) => {
            const seed = (i * 37 + 13) % 100;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + (seed % 3)}px`,
                  height: `${2 + (seed % 3)}px`,
                  left: `${(seed * 7 + i * 11) % 100}%`,
                  bottom: `${5 + (seed * 3) % 30}%`,
                  backgroundColor: `rgba(245, 181, 68, ${0.06 + (seed % 20) * 0.006})`,
                }}
              />
            );
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
              const seed = (i * 47 + 7) % 100;
              return (
                <line key={i}
                  x1={`${(seed * 3) % 100}%`} y1={`${(seed * 7) % 100}%`}
                  x2={`${(seed * 3 + 20) % 100}%`} y2={`${(seed * 7 + 15) % 100}%`}
                  stroke="#3B82F6" strokeWidth="0.5" />
              );
            })}
            {Array.from({ length: 16 }, (_, i) => {
              const seed = (i * 29 + 3) % 100;
              return (
                <circle key={`n${i}`} cx={`${(seed * 5) % 100}%`} cy={`${(seed * 3 + 10) % 100}%`}
                  r="1.5" fill="#3B82F6" opacity={0.2 + (seed % 30) * 0.01} />
              );
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
                style={{ left: `${i * 16}%`, top: `${(i * 23 + 10) % 60}%` }}>
                {Array.from({ length: 50 }, (_, j) => ((i * 7 + j) % 2).toString()).join("")}
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
