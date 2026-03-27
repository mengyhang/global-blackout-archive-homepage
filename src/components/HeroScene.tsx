import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 0: Hero — 黑暗降临
 * 光点从黑暗中亮起 → Slogan 浮现 → 滚动后整体淡出
 *
 * 修复：使用 gsap.context 作用域，pin 结束时淡出避免重复
 */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx2d = canvas.getContext("2d")!;
    let animationId: number;
    let progress = 0;

    const lights: {
      x: number;
      y: number;
      baseRadius: number;
      phase: number;
      brightness: number;
      delay: number;
    }[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateLights();
    }

    function generateLights() {
      lights.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 2500);
      for (let i = 0; i < count; i++) {
        // 光点集中在画面中下部，模拟从高空俯瞰城市
        const yBias = 0.3 + Math.random() * 0.6;
        lights.push({
          x: Math.random() * canvas.width,
          y: yBias * canvas.height,
          baseRadius: Math.random() * 1.8 + 0.3,
          phase: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.5 + 0.3,
          delay: Math.random(),
        });
      }
    }

    function draw(time: number) {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      for (const light of lights) {
        const appear = Math.max(0, Math.min(1, (progress - light.delay * 0.5) * 3));
        if (appear <= 0) continue;

        const flicker = 0.7 + 0.3 * Math.sin(time * 0.0008 + light.phase);
        const alpha = light.brightness * flicker * appear;
        const radius = light.baseRadius * (0.8 + 0.2 * flicker) * appear;

        // 光点
        ctx2d.beginPath();
        ctx2d.arc(light.x, light.y, radius, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(245, 181, 68, ${alpha})`;
        ctx2d.fill();

        // 光晕
        if (radius > 0.8) {
          const gradient = ctx2d.createRadialGradient(
            light.x, light.y, 0,
            light.x, light.y, radius * 5
          );
          gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.2})`);
          gradient.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.05})`);
          gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx2d.beginPath();
          ctx2d.arc(light.x, light.y, radius * 5, 0, Math.PI * 2);
          ctx2d.fillStyle = gradient;
          ctx2d.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    // GSAP 滚动控制 — 使用 context 作用域
    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=150%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      // 0-0.5: 光点从无到有 + 文字渐入
      tl.to(
        { value: 0 },
        {
          value: 1,
          duration: 0.5,
          onUpdate: function () {
            progress = this.targets()[0].value;
          },
        },
        0
      );

      tl.fromTo(".hero-slogan", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.2);
      tl.fromTo(".hero-slogan-en", { opacity: 0, y: 20 }, { opacity: 0.7, y: 0, duration: 0.2 }, 0.35);
      tl.fromTo(".hero-subtitle", { opacity: 0, y: 15 }, { opacity: 0.5, y: 0, duration: 0.2 }, 0.4);
      tl.fromTo(".hero-scroll-hint", { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.5);

      // 0.65-1.0: 整体淡出（解决滚动重复问题）
      tl.to(".hero-content", { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" }, 0.65);
      tl.to(
        { value: 1 },
        {
          value: 0,
          duration: 0.3,
          onUpdate: function () {
            progress = this.targets()[0].value;
          },
        },
        0.7
      );
    }, container);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gsapCtx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 中心辉光（非常微妙的氛围光） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.03) 0%, transparent 50%)",
        }}
      />

      <div className="hero-content absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="hero-slogan font-serif text-4xl md:text-6xl lg:text-7xl text-text-primary tracking-[0.08em] leading-tight opacity-0">
          铭记黑暗，守护光明
        </h1>
        <p className="hero-slogan-en font-display text-base md:text-xl text-text-secondary/70 mt-5 tracking-[0.15em] opacity-0">
          Light fades. Memory endures.
        </p>
        <div className="hero-subtitle mt-14 opacity-0 text-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent mx-auto mb-4" />
          <p className="font-serif text-sm md:text-base text-text-tertiary/80 tracking-[0.1em]">
            全球大停电事故档案库
          </p>
          <p className="font-display text-xs text-text-tertiary/40 mt-1 tracking-[0.15em]">
            Global Blackout Archive
          </p>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-0">
        <span className="text-text-tertiary/40 text-[10px] tracking-[0.3em] uppercase">
          Scroll to explore
        </span>
        <div className="w-px h-10 relative overflow-hidden">
          <div className="absolute top-0 w-full h-full bg-gradient-to-b from-amber/50 to-transparent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
