import { useEffect, useState, useRef } from "react";
import MainScenes from "./MainScenes";

interface NarrativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NarrativeModal({ isOpen, onClose }: NarrativeModalProps) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('narrative-muted') === 'true';
    }
    return false;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    console.log('[Audio] Modal opened, isMuted:', isMuted);
    const audio = new Audio('/audio/narrative-bg.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio.addEventListener('loadeddata', () => console.log('[Audio] File loaded successfully'));
    audio.addEventListener('error', (e) => console.error('[Audio] Load error:', e));
    audio.addEventListener('play', () => console.log('[Audio] Playing'));
    audio.addEventListener('pause', () => console.log('[Audio] Paused'));

    let fadeInterval: number;

    if (!isMuted) {
      console.log('[Audio] Attempting to play...');
      audio.play()
        .then(() => console.log('[Audio] Play started successfully'))
        .catch(err => console.error('[Audio] Autoplay blocked:', err));

      fadeInterval = window.setInterval(() => {
        if (audio.volume < 0.3) {
          audio.volume = Math.min(0.3, audio.volume + 0.02);
        } else {
          clearInterval(fadeInterval);
          console.log('[Audio] Fade in complete, volume:', audio.volume);
        }
      }, 50);
    }

    return () => {
      console.log('[Audio] Cleaning up...');
      clearInterval(fadeInterval);
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume = Math.max(0, audio.volume - 0.02);
        } else {
          clearInterval(fadeOut);
          audio.pause();
          audio.currentTime = 0;
        }
      }, 50);
    };
  }, [isOpen, isMuted]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('narrative-muted', String(newMuted));

    if (audioRef.current) {
      if (newMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* 控制按钮组 */}
      <div className="fixed top-6 right-6 z-[60] flex gap-3">
        {/* 静音按钮 */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 flex items-center justify-center rounded-lg
                     border border-amber-500/50 text-amber-100 hover:border-amber-400
                     hover:text-amber-50 transition-all duration-300
                     hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          aria-label={isMuted ? "取消静音" : "静音"}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-lg
                     border border-amber-500/50 text-amber-100 hover:border-amber-400
                     hover:text-amber-50 transition-all duration-300
                     hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          aria-label="关闭叙事"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 叙事内容 */}
      <MainScenes />
    </div>
  );
}
