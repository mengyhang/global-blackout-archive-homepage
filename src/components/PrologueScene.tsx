import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * 序幕：光的起源
 * 1896年第一盏灯 → 1908年第一个电机专科 → 使命的诞生
 */
export default function PrologueScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let lightProgress = 0;
    let tl: gsap.core.Timeline;

    const lights: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      delay: number;
    }> = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateLights();
    }

    function generateLights() {
      lights.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 80; i++) {
        const angle = (i / 80) * Math.PI * 2;
        const distance = 50 + i * 8;
        lights.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: 1 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.4,
          delay: i * 0.012,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const light of lights) {
        const appear = Math.max(0, Math.min(1, (lightProgress - light.delay) * 2));
        if (appear <= 0) continue;

        const alpha = light.alpha * appear;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius * appear, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 181, 68, ${alpha})`;
        ctx.fill();

        if (light.radius > 1) {
          const gradient = ctx.createRadialGradient(
            light.x, light.y, 0,
            light.x, light.y, light.radius * 6
          );
          gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.3})`);
          gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(light.x, light.y, light.radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(draw);

    // 动画时间线
    const startAnimation = () => {
      if (tl) tl.kill();

      // 重置所有元素状态
      gsap.set(".year-1896", { opacity: 0, scale: 0.9 });
      gsap.set(".first-light", { opacity: 0, y: 20 });
      gsap.set(".year-1908", { opacity: 0, scale: 0.9 });
      gsap.set(".first-dept", { opacity: 0, y: 20 });
      gsap.set(".mission", { opacity: 0, y: 30, visibility: "hidden" });
      lightProgress = 0;

      tl = gsap.timeline();
      tl.fromTo(".year-1896",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
      );

      tl.to({ value: 0 }, {
        value: 1,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function() {
          lightProgress = this.targets()[0].value;
        }
      }, "-=0.5");

      tl.fromTo(".first-light",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=1.5"
      );

      tl.to(".year-1896", { opacity: 0, duration: 0.8 }, "+=1");
      tl.fromTo(".year-1908",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=0.3"
      );

      tl.fromTo(".first-dept",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      tl.to([".year-1908", ".first-dept"], { opacity: 0, duration: 0.8 }, "+=1.5");
      tl.set(".mission", { visibility: "visible" });
      tl.fromTo(".mission",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        "-=0.3"
      );
    };

    startAnimation();

    // 监听场景切换事件
    const handleSceneEnter = () => {
      startAnimation();
    };

    const handleTogglePlay = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.isPlaying) {
        tl.play();
      } else {
        tl.pause();
      }
    };

    window.addEventListener('scene-enter', handleSceneEnter);
    window.addEventListener('scene-toggle-play', handleTogglePlay);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener('scene-enter', handleSceneEnter);
      window.removeEventListener('scene-toggle-play', handleTogglePlay);
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 1896年 */}
      <div className="year-1896 absolute inset-0 flex flex-col items-center justify-center opacity-0">
        <div className="text-center px-6">
          <div className="font-mono text-7xl md:text-9xl text-amber-400 mb-10 tracking-wider font-bold">1896</div>
          <p className="first-light font-serif text-2xl md:text-4xl text-gray-100 opacity-0">
            当盛宣怀在南洋公学点亮第一盏电灯
          </p>
        </div>
      </div>

      {/* 1908年 */}
      <div className="year-1908 absolute inset-0 flex flex-col items-center justify-center opacity-0">
        <div className="text-center px-6">
          <div className="font-mono text-7xl md:text-9xl text-amber-400 mb-10 tracking-wider font-bold">1908</div>
          <p className="first-dept font-serif text-2xl md:text-4xl text-gray-100 opacity-0">
            中国第一个电机专科在这里诞生
          </p>
        </div>
      </div>

      {/* 使命 */}
      <div className="mission absolute inset-0 flex items-center justify-center opacity-0">
        <div className="text-center px-6 max-w-4xl">
          <p className="font-serif text-3xl md:text-5xl text-gray-200 leading-relaxed mb-8">
            从那一刻起
          </p>
          <p className="font-serif text-4xl md:text-6xl text-amber-400 leading-relaxed font-semibold">
            守护光明，成为一代代交大人的使命
          </p>
        </div>
      </div>
    </section>
  );
}
