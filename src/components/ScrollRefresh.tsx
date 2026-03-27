import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 全局 ScrollTrigger 刷新器
 * 等待所有组件挂载后，统一刷新 pin 的位置计算，修复多 pin 排序问题
 */
export default function ScrollRefresh() {
  useEffect(() => {
    // 等待所有组件渲染完毕后刷新，多次刷新确保后续 pin 位置准确
    const timer1 = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 300);
    const timer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return null;
}
