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
 * 单幕组件：标题 + 事件卡片 + 幕间暗线
 */
export default function ActSection({ actInfo }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const events = blackoutEvents.filter((e) => e.act === actInfo.act);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 幕标题动画
      gsap.fromTo(
        section.querySelector(".act-heading"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 卡片错开动画
      gsap.fromTo(
        section.querySelectorAll(".card-item"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section.querySelector(".cards-grid"),
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 暗线文字动画
      gsap.fromTo(
        section.querySelector(".sjtu-line"),
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section.querySelector(".sjtu-line"),
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        section.querySelector(".sjtu-text"),
        { opacity: 0, y: 10 },
        {
          opacity: 0.7,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: {
            trigger: section.querySelector(".sjtu-text"),
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // 第五幕特殊布局（只有一个事件，更大更醒目）
  const isFinale = actInfo.act === 5;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 md:py-32 px-6"
    >
      {/* 背景装饰 */}
      <ActBackground act={actInfo.act} />

      {/* 幕标题 */}
      <div className="act-heading text-center mb-16 md:mb-20 relative z-10">
        <div className="font-mono text-amber/50 text-sm tracking-[0.3em] mb-3">
          ACT {actInfo.act}
        </div>
        <h2 className="act-title">{actInfo.title}</h2>
        <p className="font-display text-text-tertiary text-base md:text-lg mt-2 tracking-wider">
          {actInfo.subtitle}
        </p>
        <p className="text-text-secondary/50 text-sm mt-4 max-w-md mx-auto">
          {actInfo.theme}
        </p>
      </div>

      {/* 事件卡片网格 */}
      <div
        className={`cards-grid relative z-10 w-full max-w-6xl mx-auto grid gap-6 ${
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
          <EventCard
            key={event.id}
            event={event}
            className={`card-item ${isFinale ? "p-8 md:p-12" : ""}`}
          />
        ))}
      </div>

      {/* 幕间 · 交大暗线 */}
      <div className="relative z-10 mt-20 md:mt-28 w-full max-w-2xl mx-auto text-center">
        <div
          className="sjtu-line h-px mx-auto origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, #9E1A2F, transparent)",
            maxWidth: "200px",
          }}
        />
        <p className="sjtu-text sjtu-whisper mt-4 font-serif text-sm">
          {actInfo.sjtuWhisper}
        </p>
      </div>
    </section>
  );
}

/** 每幕独特的背景效果 */
function ActBackground({ act }: { act: number }) {
  switch (act) {
    case 1:
      // 城市剪影 + 暗光
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-deep-navy/50 to-transparent" />
          {/* 窗户灯光散点 */}
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 30}%`,
                backgroundColor: `rgba(245, 181, 68, ${0.1 + Math.random() * 0.2})`,
                animation: `flicker ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      );
    case 2:
      // 极光粒子
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-1/2 h-2/3 rounded-full opacity-[0.03] blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, #06B6D4, #3B82F6, transparent)",
            }}
          />
          <div
            className="absolute top-1/4 right-1/4 w-1/3 h-1/2 rounded-full opacity-[0.02] blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, #10B981, #06B6D4, transparent)",
            }}
          />
        </div>
      );
    case 3:
      // 节点网络
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
            {Array.from({ length: 15 }, (_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = x1 + (Math.random() - 0.5) * 30;
              const y2 = y1 + (Math.random() - 0.5) * 30;
              return (
                <line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
              );
            })}
            {Array.from({ length: 20 }, (_, i) => (
              <circle
                key={`n-${i}`}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r="2"
                fill="#3B82F6"
                opacity={0.3 + Math.random() * 0.3}
              />
            ))}
          </svg>
        </div>
      );
    case 4:
      // 数字矩阵/glitch
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute font-mono text-xs leading-none whitespace-nowrap text-green-400"
                style={{
                  left: `${i * 12.5}%`,
                  top: `${Math.random() * 50}%`,
                  transform: `rotate(${-2 + Math.random() * 4}deg)`,
                  opacity: 0.5 + Math.random() * 0.5,
                }}
              >
                {Array.from({ length: 40 }, () =>
                  Math.random() > 0.5 ? "1" : "0"
                ).join("")}
              </div>
            ))}
          </div>
          <div
            className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full opacity-[0.02] blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, #38BDF8, transparent)",
            }}
          />
        </div>
      );
    case 5:
      // 微光渗透
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 opacity-[0.04] blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at bottom, #F59E0B, transparent 70%)",
            }}
          />
        </div>
      );
    default:
      return null;
  }
}
