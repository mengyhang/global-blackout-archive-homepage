import type { BlackoutEvent } from "../data/blackouts";

interface Props {
  event: BlackoutEvent;
  className?: string;
}

/**
 * 事件卡片 — 深色玻璃质感，左侧渐变竖线，hover 浮起发光
 */
export default function EventCard({ event, className = "" }: Props) {
  return (
    <a
      href={`/events/${event.slug}`}
      className={`event-card group block p-6 md:p-7 ${className}`}
    >
      {/* 年份 */}
      <div className="font-mono text-amber/60 text-[11px] tracking-[0.15em] mb-3">
        {event.year}.{event.date.split("-")[1]}.{event.date.split("-")[2]}
      </div>

      {/* 事件名 */}
      <h3 className="font-serif text-lg md:text-xl text-text-primary/90 mb-3 group-hover:text-amber transition-colors duration-300 leading-snug">
        {event.nameCn}
      </h3>

      {/* 钩子 */}
      <p className="text-text-secondary/60 text-sm leading-relaxed italic">
        "{event.hook}"
      </p>

      {/* 底部信息 */}
      <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center gap-3 text-[11px] text-text-tertiary/60">
        <span>{event.location}</span>
        <span className="w-px h-3 bg-white/[0.06]" />
        <span>{event.affectedPeople}</span>
      </div>

      {/* hover 探索提示 */}
      <div className="mt-3 flex items-center gap-1.5 text-amber/0 group-hover:text-amber/60 transition-all duration-300 text-[11px] tracking-[0.1em]">
        <span>探索档案</span>
        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
