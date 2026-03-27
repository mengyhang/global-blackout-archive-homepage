import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 0: 入场引导 + Hero
 *
 * 将 SJTU 献礼信息合并到 Hero 中（不再是独立 overlay），
 * 这样回滚时 SJTU 文字能自然恢复。
 *
 * 时间线：SJTU 献礼 → 光点亮起 + Slogan → 淡出
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
      x: number; y: number; baseRadius: number;
      phase: number; brightness: number; delay: number;
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

        ctx2d.beginPath();
        ctx2d.arc(light.x, light.y, radius, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(245, 181, 68, ${alpha})`;
        ctx2d.fill();

        if (radius > 0.8) {
          const gradient = ctx2d.createRadialGradient(light.x, light.y, 0, light.x, light.y, radius * 5);
          gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.2})`);
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

    const gsapCtx = gsap.context(() => {
      // ===== 自动播放入场动画（不依赖滚动，页面加载即播放） =====
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl.fromTo(".intro-course", { opacity: 0, y: -8 }, { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" });
      introTl.fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 0.3);
      introTl.fromTo(".intro-dedication", { opacity: 0 }, { opacity: 0.5, duration: 0.7 }, 0.7);
      introTl.fromTo(".intro-title", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 1.1);
      introTl.fromTo(".intro-slogan", { opacity: 0 }, { opacity: 0.8, duration: 0.7 }, 1.7);
      introTl.fromTo(".intro-hint", { opacity: 0 }, { opacity: 0.6, duration: 0.5 }, 2.3);

      // ===== 滚动驱动时间线 =====
      // 三个阶段紧密衔接，无空白：
      //   0.00-0.12  SJTU淡出（同时光点开始生长）
      //   0.08-0.45  光点+Slogan淡入
      //   0.45-0.72  停留展示
      //   0.72-0.92  整体淡出
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=280%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      // SJTU 淡出 + 光点同时开始生长（无缝过渡）
      tl.to(".intro-content", { opacity: 0, y: -15, duration: 0.12, ease: "power2.in" }, 0.00);
      tl.to(
        { value: 0 },
        { value: 1, duration: 0.30, onUpdate() { progress = this.targets()[0].value; } },
        0.05
      );

      // Slogan 紧跟光点出现
      tl.fromTo(".hero-slogan", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.18);
      tl.fromTo(".hero-slogan-en", { opacity: 0, y: 12 }, { opacity: 0.7, y: 0, duration: 0.10 }, 0.28);
      tl.fromTo(".hero-subtitle", { opacity: 0, y: 10 }, { opacity: 0.5, y: 0, duration: 0.10 }, 0.35);
      tl.fromTo(".hero-scroll-hint", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.42);

      // 停留展示 0.45 - 0.72（无动画，内容完全可见）

      // 整体淡出
      tl.to(".hero-content", { opacity: 0, y: -20, duration: 0.15, ease: "power2.in" }, 0.74);
      tl.to(".hero-scroll-hint", { opacity: 0, duration: 0.08 }, 0.74);
      tl.to(
        { value: 1 },
        { value: 0, duration: 0.18, onUpdate() { progress = this.targets()[0].value; } },
        0.78
      );
    }, container);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gsapCtx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 背景氛围光 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.03) 0%, transparent 50%)" }} />

      {/* ===== SJTU 献礼信息（第一阶段） ===== */}
      <div className="intro-content absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="text-center px-6 max-w-2xl">
          <p className="intro-course font-sans text-xs md:text-sm text-text-tertiary tracking-[0.25em] opacity-0">
            上海交通大学 · 电力系统安全分析课程组
          </p>
          <div className="intro-line w-24 h-px mx-auto my-6 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, #9E1A2F, transparent)", transform: "scaleX(0)" }} />
          <p className="intro-dedication font-serif text-xs md:text-sm tracking-[0.3em] opacity-0" style={{ color: "#9E1A2F" }}>
            献礼上海交通大学建校130周年
          </p>
          <h1 className="intro-title font-serif text-2xl md:text-4xl lg:text-5xl text-text-primary mt-8 tracking-wider leading-tight opacity-0 whitespace-nowrap">
            全球大停电事故档案库
          </h1>
          <div className="intro-slogan mt-8 space-y-1 opacity-0">
            <p className="font-serif text-base md:text-lg text-amber/80 tracking-widest">铭记黑暗，守护光明</p>
            <p className="font-display text-xs md:text-sm text-text-tertiary/60 tracking-[0.2em]">Light fades. Memory endures.</p>
          </div>
        </div>
        <div className="intro-hint absolute bottom-12 text-center opacity-0">
          <p className="text-text-tertiary/50 text-xs tracking-[0.2em] mb-3">向下滚动开始探索</p>
          <div className="flex flex-col items-center">
            <div className="w-5 h-8 rounded-full border border-text-tertiary/30 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-text-tertiary/50 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Hero 主内容（第二阶段） ===== */}
      <div className="hero-content absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h2 className="hero-slogan font-serif text-4xl md:text-6xl lg:text-7xl text-text-primary tracking-[0.08em] leading-tight opacity-0">
          铭记黑暗，守护光明
        </h2>
        <p className="hero-slogan-en font-display text-base md:text-xl text-text-secondary/70 mt-5 tracking-[0.15em] opacity-0">
          Light fades. Memory endures.
        </p>
        <div className="hero-subtitle mt-14 opacity-0 text-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent mx-auto mb-4" />
          <p className="font-serif text-sm md:text-base text-text-tertiary/80 tracking-[0.1em]">全球大停电事故档案库</p>
          <p className="font-display text-xs text-text-tertiary/40 mt-1 tracking-[0.15em]">Global Blackout Archive</p>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-0">
        <span className="text-text-tertiary/40 text-[10px] tracking-[0.3em] uppercase">Scroll to explore</span>
        <div className="w-px h-10 relative overflow-hidden">
          <div className="absolute top-0 w-full h-full bg-gradient-to-b from-amber/50 to-transparent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
