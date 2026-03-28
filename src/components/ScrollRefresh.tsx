import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 全局 ScrollTrigger 刷新器
 * 多次刷新确保所有 pin 位置计算准确（含异步加载的地图数据）
 */
export default function ScrollRefresh() {
  useEffect(() => {
    const timers = [
      setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 300),
      setTimeout(() => { ScrollTrigger.refresh(); }, 800),
      setTimeout(() => { ScrollTrigger.refresh(); }, 1500), // 地图数据加载后再刷一次
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
