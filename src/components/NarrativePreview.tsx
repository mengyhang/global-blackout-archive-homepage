import { useEffect, useRef } from "react";

interface NarrativePreviewProps {
  onEnter: () => void;
}

export default function NarrativePreview({ onEnter }: NarrativePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 创建星星
    const stars: Array<{ x: number; y: number; radius: number; opacity: number; speed: number; vx: number; vy: number }> = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.002 + 0.001,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // 闪烁效果
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;

        // 移动效果
        star.x += star.vx;
        star.y += star.vy;

        // 边界检测
        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${star.opacity * 0.8})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <button
      onClick={onEnter}
      className="relative w-full h-[30vh] bg-black overflow-hidden cursor-pointer group block"
      aria-label="点击进入沉浸式体验"
    >
      {/* 动态星空背景 */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 主文案 - 居中 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-amber-400 leading-relaxed text-center
                       group-hover:text-amber-300 transition-colors duration-300">
          守护光明，
          <br />
          是一代代交大人的使命
        </h1>
      </div>
    </button>
  );
}
