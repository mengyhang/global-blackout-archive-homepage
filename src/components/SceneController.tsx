import { useEffect, useState, useCallback } from "react";
import gsap from "gsap";

/**
 * 场景控制器 - 替代纯滚轮驱动
 *
 * 特性：
 * - 自动播放（可暂停）
 * - 手动控制（点击/键盘/滚轮）
 * - 场景导航
 * - 关键停顿
 */

export interface SceneConfig {
  id: string;
  duration: number; // 自动播放时的停留时长（秒）
  pauseOnEnter?: boolean; // 进入时是否自动暂停
}

interface Props {
  scenes: SceneConfig[];
  onSceneChange: (sceneIndex: number, progress: number) => void;
  autoPlay?: boolean;
}

export default function SceneController({ scenes, onSceneChange, autoPlay = true }: Props) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  // 前进到下一场景
  const nextScene = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setProgress(0);
    }
  }, [currentScene, scenes.length]);

  // 后退到上一场景
  const prevScene = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setProgress(0);
    }
  }, [currentScene]);

  // 跳转到指定场景
  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentScene(index);
      setProgress(0);
    }
  }, [scenes.length]);

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying) return;

    const scene = scenes[currentScene];
    if (scene.pauseOnEnter) {
      setIsPlaying(false);
      return;
    }

    const duration = scene.duration * 1000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        clearInterval(timer);
        nextScene();
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isPlaying, currentScene, scenes, nextScene]);

  // 通知父组件场景变化
  useEffect(() => {
    onSceneChange(currentScene, progress);
  }, [currentScene, progress, onSceneChange]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextScene();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevScene();
      } else if (e.key === "p" || e.key === "P") {
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene]);

  // 滚轮控制（节流）
  useEffect(() => {
    let lastScroll = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScroll < 800) return; // 节流
      lastScroll = now;

      if (e.deltaY > 0) {
        nextScene();
      } else if (e.deltaY < 0) {
        prevScene();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextScene, prevScene]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      {/* 播放/暂停 */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all"
        aria-label={isPlaying ? "暂停" : "播放"}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* 场景导航点 */}
      <div className="flex items-center gap-2">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => goToScene(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentScene
                ? "w-8 bg-amber"
                : index < currentScene
                ? "w-2 bg-white/40"
                : "w-2 bg-white/20"
            }`}
            aria-label={`场景 ${index + 1}`}
          />
        ))}
      </div>

      {/* 前进/后退 */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevScene}
          disabled={currentScene === 0}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="上一场景"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          onClick={nextScene}
          disabled={currentScene === scenes.length - 1}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="下一场景"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
