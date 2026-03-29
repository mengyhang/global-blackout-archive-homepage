import { useEffect, useState, useCallback, useRef } from "react";
import gsap from "gsap";

interface Scene {
  id: string;
  component: React.ReactNode;
}

interface Props {
  scenes: Scene[];
}

export default function SceneNavigator({ scenes }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const sceneRefs = useRef<Map<number, HTMLElement>>(new Map());

  const goToScene = useCallback((index: number) => {
    if (index < 0 || index >= scenes.length || isTransitioning) return;
    if (index === currentIndex) return;

    setIsTransitioning(true);
    setIsPlaying(true); // 切换场景时重新开始播放

    const direction = index > currentIndex ? 1 : -1;
    const current = document.querySelector(`[data-scene="${currentIndex}"]`);
    const next = document.querySelector(`[data-scene="${index}"]`);

    if (current && next) {
      gsap.to(current, {
        opacity: 0,
        y: direction * -30,
        duration: 0.6,
        ease: "power2.inOut"
      });

      gsap.fromTo(next,
        { opacity: 0, y: direction * 30, display: "flex" },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            setIsTransitioning(false);
            if (current) (current as HTMLElement).style.display = "none";

            // 触发场景重新播放
            const event = new CustomEvent('scene-enter', { detail: { sceneIndex: index } });
            window.dispatchEvent(event);
          }
        }
      );
    }

    setCurrentIndex(index);
  }, [currentIndex, scenes.length, isTransitioning]);

  const nextScene = useCallback(() => {
    goToScene(currentIndex + 1);
  }, [currentIndex, goToScene]);

  const prevScene = useCallback(() => {
    goToScene(currentIndex - 1);
  }, [currentIndex, goToScene]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
    const event = new CustomEvent('scene-toggle-play', { detail: { isPlaying: !isPlaying } });
    window.dispatchEvent(event);
  }, [isPlaying]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextScene();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevScene();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene, togglePlay]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" onClick={togglePlay}>
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          data-scene={index}
          className="absolute inset-0 w-full h-full"
          style={{ display: index === 0 ? "flex" : "none" }}
        >
          {scene.component}
        </div>
      ))}

      <button
        onClick={(e) => { e.stopPropagation(); prevScene(); }}
        disabled={currentIndex === 0}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all flex items-center justify-center group"
      >
        <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); nextScene(); }}
        disabled={currentIndex === scenes.length - 1}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all flex items-center justify-center group"
      >
        <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  );
}
