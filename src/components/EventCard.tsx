import type { BlackoutEvent } from "../data/blackouts";

interface Props {
  event: BlackoutEvent;
  className?: string;
}

/**
 * 事件卡片组件
 * 深色玻璃质感，左侧 amber 竖线，hover 浮起
 */
export default function EventCard({ event, className = "" }: Props) {
  return (
    <a
      href={`/events/${event.slug}`}
      className={`event-card group block p-6 md:p-8 cursor-pointer ${className}`}
    >
      {/* 年份 */}
      <div className="font-mono text-amber/80 text-sm tracking-wider mb-2">
        {event.year}
      </div>

      {/* 事件名 */}
      <h3 className="font-serif text-xl md:text-2xl text-text-primary mb-3 group-hover:text-amber transition-colors duration-300">
        {event.nameCn}
      </h3>

      {/* 钩子文案 */}
      <p className="text-text-secondary text-sm md:text-base leading-relaxed">
        "{event.hook}"
      </p>

      {/* 底部信息 */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-text-tertiary">
        <span>{event.location}</span>
        <span className="text-text-tertiary/30">|</span>
        <span>影响 {event.affectedPeople}</span>
      </div>

      {/* 探索箭头 */}
      <div className="mt-3 flex items-center gap-1 text-amber/0 group-hover:text-amber/70 transition-all duration-300 text-xs tracking-wider">
        <span>探索档案</span>
        <svg
          className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </a>
  );
}
