import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * 入场引导层
 * 页面加载即显示，展示 SJTU 献礼信息，滚动或点击后淡出
 * 这是用户看到的第一个画面——不是漆黑，而是庄重的开场
 */
export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // 入场动画序列
    const tl = gsap.timeline();

    // 中央光线展开
    tl.fromTo(
      ".intro-line",
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
      0.3
    );

    // 课程信息
    tl.fromTo(
      ".intro-course",
      { opacity: 0, y: -10 },
      { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" },
      0.8
    );

    // 献礼文字
    tl.fromTo(
      ".intro-dedication",
      { opacity: 0 },
      { opacity: 0.5, duration: 0.8 },
      1.2
    );

    // 项目名称
    tl.fromTo(
      ".intro-title",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      1.6
    );

    // Slogan
    tl.fromTo(
      ".intro-slogan",
      { opacity: 0 },
      { opacity: 0.8, duration: 0.8 },
      2.2
    );

    // 引导提示（延迟出现）
    tl.fromTo(
      ".intro-hint",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      3
    );

    // 监听滚动或点击，触发淡出
    function dismiss() {
      if (dismissed) return;
      setDismissed(true);

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          overlay.style.display = "none";
          // 解锁页面滚动
          document.body.style.overflow = "";
        },
      });
    }

    // 锁定滚动直到引导完成
    document.body.style.overflow = "hidden";

    // 3秒后解锁（允许滚动触发消失）
    const unlockTimer = setTimeout(() => {
      document.body.style.overflow = "";
      window.addEventListener("scroll", dismiss, { once: true });
    }, 3000);

    overlay.addEventListener("click", dismiss);

    return () => {
      clearTimeout(unlockTimer);
      window.removeEventListener("scroll", dismiss);
      overlay.removeEventListener("click", dismiss);
      document.body.style.overflow = "";
    };
  }, [dismissed]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-black cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {/* 微妙的背景纹理 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(245,158,11,0.08) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* 课程与学校信息 */}
        <p className="intro-course font-sans text-xs md:text-sm text-text-tertiary tracking-[0.25em] uppercase opacity-0">
          上海交通大学 · 电力系统安全分析课程组
        </p>

        {/* 装饰线 */}
        <div
          className="intro-line w-24 h-px mx-auto my-6 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, #9E1A2F, transparent)",
            transform: "scaleX(0)",
          }}
        />

        {/* 献礼文字 */}
        <p
          className="intro-dedication font-serif text-xs md:text-sm tracking-[0.3em] opacity-0"
          style={{ color: "#9E1A2F" }}
        >
          献礼上海交通大学建校130周年
        </p>

        {/* 项目名称 */}
        <h1 className="intro-title font-serif text-3xl md:text-5xl lg:text-6xl text-text-primary mt-8 tracking-wider leading-tight opacity-0">
          全球大停电事故档案库
        </h1>

        {/* Slogan */}
        <div className="intro-slogan mt-8 space-y-1 opacity-0">
          <p className="font-serif text-base md:text-lg text-amber/80 tracking-widest">
            铭记黑暗，守护光明
          </p>
          <p className="font-display text-xs md:text-sm text-text-tertiary/60 tracking-[0.2em]">
            Light fades. Memory endures.
          </p>
        </div>
      </div>

      {/* 底部引导 */}
      <div className="intro-hint absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-0">
        <p className="text-text-tertiary/50 text-xs tracking-[0.2em] mb-3">
          向下滚动 或 点击任意处 开始探索
        </p>
        <div className="flex flex-col items-center">
          <div className="w-5 h-8 rounded-full border border-text-tertiary/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-text-tertiary/50 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
