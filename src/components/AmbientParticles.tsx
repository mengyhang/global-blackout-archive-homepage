import { useEffect, useRef } from "react";

/**
 * 全局浮动光粒子 — 极其克制的版本
 * 少量、缓慢、微弱，像远处的萤火虫，纯粹锦上添花
 */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  phase: number;
  baseAlpha: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,  // 非常缓慢
    vy: (Math.random() - 0.5) * 0.1,
    radius: 0.6 + Math.random() * 0.8,  // 很小：0.6-1.4px
    phase: Math.random() * Math.PI * 2,
    baseAlpha: 0.15 + Math.random() * 0.2, // 很淡：0.15-0.35
  };
}

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let targetCount = 6;
    let brightness = 0.2;
    let convergeTarget: { x: number; y: number } | null = null;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 根据滚动位置微调（非常克制的变化）
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (ratio < 0.2)      { targetCount = 6;  brightness = 0.12; }
      else if (ratio < 0.4) { targetCount = 8;  brightness = 0.18; }
      else if (ratio < 0.75){ targetCount = 12; brightness = 0.25; }
      else                  { targetCount = 18; brightness = 0.35; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 自定义事件（尾声粒子汇聚用）
    const onScene = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (!d) return;
      if (d.targetCount !== undefined) targetCount = Math.min(d.targetCount, 25);
      if (d.brightness !== undefined) brightness = Math.min(d.brightness, 0.5);
      convergeTarget = d.converge ?? null;
    };
    window.addEventListener("ambient-scene", onScene);

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const now = performance.now() * 0.001;

      // 缓慢调整粒子数量（每帧最多加/减1个）
      if (particles.length < targetCount) particles.push(createParticle(w, h));
      else if (particles.length > targetCount) particles.pop();

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (convergeTarget) {
          p.vx += (convergeTarget.x - p.x) * 0.001;
          p.vy += (convergeTarget.y - p.y) * 0.001;
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // 非常缓慢的呼吸
        const breath = 0.7 + 0.3 * Math.sin(now * 0.4 + p.phase);
        const alpha = p.baseAlpha * brightness * breath;

        if (alpha < 0.01) continue; // 太淡就跳过

        // 光点（无光晕，保持干净）
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 181, 68, ${alpha})`;
        ctx.fill();

        // 只有稍大的点才加微弱光晕
        if (p.radius > 1 && alpha > 0.04) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          g.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.15})`);
          g.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("ambient-scene", onScene);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
