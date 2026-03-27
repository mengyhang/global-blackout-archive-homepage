import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 右侧滚动进度指示器 — 细线 + 光点
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const dot = dotRef.current;
    if (!bar || !dot) return;

    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      bar.style.transform = `scaleY(${progress})`;
      dot.style.top = `${progress * 100}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed right-3 top-0 bottom-0 z-50 flex items-stretch pointer-events-none">
      <div className="relative w-px h-full bg-white/[0.04]">
        <div
          ref={barRef}
          className="absolute top-0 left-0 w-full h-full origin-top bg-amber/30"
          style={{ transform: "scaleY(0)" }}
        />
        <div
          ref={dotRef}
          className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-amber"
          style={{ top: "0%", boxShadow: "0 0 8px rgba(245,158,11,0.4)" }}
        />
      </div>
    </div>
  );
}
