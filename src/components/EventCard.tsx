import type { BlackoutEvent } from "../data/blackouts";

interface Props {
  event: BlackoutEvent;
  className?: string;
}

/**
 * 事件卡片 — 深色玻璃质感，左侧渐变竖线，hover 浮起发光
 * 档案风格：案号、顶部分割线、网格纹理、2025 事件呼吸边框
 */
export default function EventCard({ event, className = "" }: Props) {
  const caseNumber = `CASE-${event.year}-${String(event.act).padStart(3, "0")}`;
  const is2025 = event.year === 2025;

  return (
    <a
      href={`/events/${event.slug}/`}
      className={`event-card group block p-6 md:p-7 ${is2025 ? "animate-glow-pulse" : ""} ${className}`}
    >
      {/* 网格纹理 — hover 时微现 */}
      <div
        className="card-grid-texture absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* 顶部分割线 */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      {/* 案号 */}
      <div className="font-mono text-[10px] text-text-tertiary/30 mb-2 tracking-[0.12em]">
        {caseNumber}
      </div>

      {/* 年份 */}
      <div className="font-mono text-amber/70 text-xs tracking-[0.15em] mb-3">
        {event.year}.{event.date.split("-")[1]}.{event.date.split("-")[2]}
      </div>

      {/* 事件名 */}
      <h3 className="font-serif text-lg md:text-xl text-text-primary mb-3 group-hover:text-amber transition-colors duration-300 leading-snug">
        {event.nameCn}
      </h3>

      {/* 钩子 */}
      <p className="text-text-secondary/70 text-sm leading-relaxed italic">
        "{event.hook}"
      </p>

      {/* 底部信息 */}
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-3 text-xs text-text-tertiary/50">
        <span>{event.location}</span>
        <span className="w-px h-3 bg-white/[0.08]" />
        <span>{event.affectedPeople}</span>
      </div>

      {/* hover 探索提示 */}
      <div className="mt-3 flex items-center gap-1.5 text-amber/0 group-hover:text-amber/70 transition-all duration-300 text-xs tracking-[0.1em]">
        <span>探索档案</span>
        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
