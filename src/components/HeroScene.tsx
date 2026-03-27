import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 0: Hero — 黑暗降临
 * 从完全黑暗中，光点亮起，Slogan 浮现
 */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let progress = 0;

    // 光点数据：模拟城市灯光
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
      const count = Math.floor((canvas.width * canvas.height) / 3000);
      for (let i = 0; i < count; i++) {
        lights.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseRadius: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.6 + 0.4,
          delay: Math.random(),
        });
      }
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const light of lights) {
        // 光点随 progress 逐渐出现
        const appear = Math.max(
          0,
          Math.min(1, (progress - light.delay * 0.5) * 3)
        );
        if (appear <= 0) continue;

        const flicker =
          0.7 + 0.3 * Math.sin(time * 0.001 + light.phase);
        const alpha = light.brightness * flicker * appear;
        const radius = light.baseRadius * (0.8 + 0.2 * flicker) * appear;

        // 光点本体
        ctx.beginPath();
        ctx.arc(light.x, light.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 181, 68, ${alpha})`;
        ctx.fill();

        // 光晕
        if (radius > 1) {
          const gradient = ctx.createRadialGradient(
            light.x, light.y, 0,
            light.x, light.y, radius * 4
          );
          gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.3})`);
          gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.beginPath();
          ctx.arc(light.x, light.y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    // GSAP 滚动控制
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
      },
    });

    // 光点从无到有
    tl.to(
      { value: 0 },
      {
        value: 1,
        duration: 1,
        onUpdate: function () {
          progress = this.targets()[0].value;
        },
      },
      0
    );

    // 文字渐入
    tl.fromTo(
      ".hero-slogan",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4 },
      0.4
    );
    tl.fromTo(
      ".hero-slogan-en",
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 0.3 },
      0.55
    );
    tl.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 0.6, y: 0, duration: 0.3 },
      0.65
    );

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* 城市灯光画布 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 文字层 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="hero-slogan font-serif text-4xl md:text-6xl lg:text-7xl text-text-primary tracking-wider opacity-0">
          铭记黑暗，守护光明
        </h1>
        <p className="hero-slogan-en font-display text-lg md:text-2xl text-text-secondary mt-4 tracking-widest opacity-0">
          Light fades. Memory endures.
        </p>
        <div className="hero-subtitle mt-12 opacity-0">
          <p className="font-sans text-sm md:text-base text-text-tertiary tracking-wider">
            全球大停电事故档案库
          </p>
          <p className="font-display text-xs md:text-sm text-text-tertiary/60 mt-1 tracking-widest">
            Global Blackout Archive
          </p>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="text-text-tertiary text-xs tracking-widest">
          SCROLL
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-text-tertiary to-transparent" />
      </div>
    </section>
  );
}
