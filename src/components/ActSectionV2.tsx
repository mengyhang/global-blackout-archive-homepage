import { useEffect, useRef } from "react";
import gsap from "gsap";
import { blackoutEvents, type ActInfo } from "../data/blackouts";

interface Props {
  actInfo: ActInfo;
}

export default function ActSectionV2({ actInfo }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const events = blackoutEvents.filter((e) => e.act === actInfo.act);
  const techData = getTechData(actInfo.act);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let tl: gsap.core.Timeline;

    const startAnimation = () => {
      if (tl) tl.kill();

      gsap.set(".act-title-line", { scaleX: 0 });
      gsap.set(".act-heading", { opacity: 0, y: 30 });
      gsap.set(".timeline-line", { scaleY: 0 });
      gsap.set(".event-card", { opacity: 0, x: -30 });
      gsap.set(".tech-card", { opacity: 0, x: 30 });
      gsap.set(".timeline-dot", { scale: 0 });

      tl = gsap.timeline();

      tl.to(".act-title-line", { scaleX: 1, duration: 0.4, ease: "power2.out" });
      tl.to(".act-heading", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
      tl.to(".timeline-line", { scaleY: 1, duration: 0.8, ease: "power2.inOut" }, "+=0.1");
      tl.to(".timeline-dot", { scale: 1, duration: 0.3, stagger: 0.15 }, "-=0.6");
      tl.to(".event-card", { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 }, "-=0.8");
      tl.to(".tech-card", { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 }, "-=0.8");
    };

    startAnimation();

    const handleSceneEnter = () => startAnimation();
    const handleTogglePlay = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.isPlaying) tl?.play();
      else tl?.pause();
    };

    window.addEventListener('scene-enter', handleSceneEnter);
    window.addEventListener('scene-toggle-play', handleTogglePlay);

    return () => {
      window.removeEventListener('scene-enter', handleSceneEnter);
      window.removeEventListener('scene-toggle-play', handleTogglePlay);
      if (tl) tl.kill();
    };
  }, [actInfo.act]);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full bg-deep-black px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="act-title-line h-[2px] w-16 bg-gradient-to-r from-transparent to-amber/40 origin-left" />
            <span className="font-mono text-xs text-amber/70 tracking-[0.4em]">第{actInfo.act}幕</span>
            <div className="act-title-line h-[2px] w-16 bg-gradient-to-l from-transparent to-amber/40 origin-right" />
          </div>
          <div className="act-heading">
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary tracking-[0.15em] mb-3 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              {actInfo.title}
            </h2>
            <p className="text-text-secondary/80 text-sm md:text-base tracking-[0.1em]">
              {actInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-[1fr_60px_1fr] gap-6 md:gap-10">
          {/* 左栏：停电事故 */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-orange-500/30">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h3 className="font-serif text-orange-400 text-base font-semibold tracking-wide">全球大停电事件</h3>
            </div>
            <div className="space-y-16">
              {events.map((event, idx) => (
                <EventCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          </div>

          {/* 中间：时间轴 */}
          <div className="relative flex flex-col items-center">
            <div className="timeline-line absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber/20 via-amber/40 to-amber/20 origin-top" />
            {events.map((event, idx) => (
              <div key={event.id} className="timeline-dot absolute w-4 h-4 rounded-full bg-amber border-2 border-deep-black shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ top: `${(idx / Math.max(events.length - 1, 1)) * 100}%` }} />
            ))}
          </div>

          {/* 右栏：交大研究 */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-red-600/30">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="font-serif text-red-400 text-base font-semibold tracking-wide">交大电气的技术攻关</h3>
            </div>
            <div className="space-y-16">
              {techData.map((tech, idx) => (
                <TechCard key={idx} tech={tech} index={idx} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 opacity-30">
          <p className="text-text-tertiary/50 text-xs italic tracking-wide">
            {actInfo.theme}
          </p>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  return (
    <div className="event-card relative">
      <div className="absolute right-0 top-1/2 w-8 h-[2px] bg-gradient-to-r from-orange-500/60 to-transparent" />
      <div className="bg-gradient-to-br from-orange-900/40 to-orange-950/20 border-2 border-orange-500/40 rounded-lg p-4 hover:border-orange-400/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all backdrop-blur-sm">
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-orange-300 text-xl font-bold drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">{event.year}</span>
          <span className="text-orange-400/60 text-xs font-mono">#{index + 1}</span>
        </div>
        <h3 className="font-serif text-orange-100 text-base font-semibold mb-2">{event.nameCn}</h3>
        <p className="text-orange-200/80 text-sm mb-2 italic">"{event.hook}"</p>
        <div className="space-y-1 text-xs text-orange-300/60">
          <div>📍 {event.location}</div>
          <div>👥 {event.affectedPeople}</div>
          <div>⏱️ {event.duration}</div>
        </div>
      </div>
    </div>
  );
}

function TechCard({ tech, index }: { tech: any; index: number }) {
  return (
    <div className="tech-card relative">
      <div className="absolute left-0 top-1/2 w-8 h-[2px] bg-gradient-to-l from-red-600/60 to-transparent" />
      <div className="bg-gradient-to-br from-red-900/40 to-red-950/20 border-2 border-red-600/40 rounded-lg p-4 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all backdrop-blur-sm">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-red-600/30 flex items-center justify-center flex-shrink-0 text-base border border-red-500/40">
            {tech.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-serif text-red-100 text-base font-semibold">{tech.title}</h4>
              <span className="text-red-400/60 text-xs font-mono">#{index + 1}</span>
            </div>
            {tech.period && (
              <span className="font-mono text-red-300/70 text-xs drop-shadow-[0_0_6px_rgba(252,165,165,0.4)]">{tech.period}</span>
            )}
          </div>
        </div>
        <p className="text-red-200/80 text-sm leading-relaxed mb-2">{tech.desc}</p>
        {tech.keywords && (
          <div className="flex flex-wrap gap-1.5">
            {tech.keywords.map((kw: string, j: number) => (
              <span key={j} className="px-2 py-0.5 rounded text-[10px] bg-red-600/15 text-red-300/90 border border-red-600/30">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getTechData(act: number) {
  switch (act) {
    case 1:
      return [
        {
          icon: "🔬",
          title: "电力系统学科奠基",
          period: "1960-1970年代",
          desc: "交大电气工程学科持续发展，研究团队扎根电力系统基础理论，为后续研究奠定基础",
          keywords: ["学科建设", "理论研究"]
        },
        {
          icon: "🛡️",
          title: "继电保护研究起步",
          period: "1985年",
          desc: "成立电力工程系，设立电力系统、继电保护及自动化学科组，标志着继电保护作为独立学科方向的体制化",
          keywords: ["继电保护", "故障隔离", "学科组建"]
        }
      ];

    case 2:
      return [
        {
          icon: "🔋",
          title: "电力传输与功率变换",
          period: "2004-2006年",
          desc: "获批建设电力传输与功率变换控制教育部重点实验室，为特高压和智能电网研究提供核心平台",
          keywords: ["教育部重点实验室", "电力传输"]
        },
        {
          icon: "⚡",
          title: "特高压输电技术储备",
          period: "2000年代",
          desc: "在高压输电、绝缘技术、电力系统动态稳定性分析等方面开展研究，为中国特高压电网突破提供科研支撑",
          keywords: ["特高压", "绝缘技术", "稳定性分析"]
        },
        {
          icon: "🌐",
          title: "智能电网研发中心",
          period: "2010年",
          desc: "国家能源智能电网（上海）研发中心揭牌，标志着交大智能电网科研能力进入国家级高水平阶段",
          keywords: ["国家级平台", "智能电网", "系统集成"]
        }
      ];

    case 3:
      return [
        {
          icon: "🔗",
          title: "复杂网络与级联故障",
          period: "2000-2010年",
          desc: "利用图论、复杂网络理论分析电网脆弱性，研究级联故障传播规律和关键节点识别方法",
          keywords: ["复杂网络", "级联故障", "脆弱性分析"]
        },
        {
          icon: "🚨",
          title: "三道防线体系研究",
          period: "2000-2010年",
          desc: "参与中国大电网安全核心研究，完善继电保护、稳定控制、安全自动装置的三道防线防御体系",
          keywords: ["三道防线", "广域保护", "紧急控制"]
        },
        {
          icon: "📊",
          title: "广域测量系统应用",
          period: "2000-2010年",
          desc: "探索广域测量系统(WAMS)在大电网中的应用，提升复杂事故下的紧急控制响应能力",
          keywords: ["WAMS", "实时监测", "协调控制"]
        }
      ];

    case 4:
      return [
        {
          icon: "🌱",
          title: "新能源并网控制",
          period: "2010-2020年",
          desc: "研究风电、光伏大规模接入后的电网稳定性，攻克弱电网适应性、功率协调控制等关键技术",
          keywords: ["新能源并网", "弱电网", "稳定性控制"]
        },
        {
          icon: "⚙️",
          title: "构网型逆变器技术",
          period: "2010年代中后期",
          desc: "开展虚拟同步发电机(VSG)、下垂控制等研究，让新能源具备同步机特性，增强系统惯量和阻尼",
          keywords: ["构网型", "虚拟同步机", "惯量支撑"]
        },
        {
          icon: "🔐",
          title: "电力网络安全",
          period: "2010-2020年",
          desc: "开辟电力系统网络安全新方向，研究信息物理融合系统(CPS)的工控安全与态势感知",
          keywords: ["网络安全", "CPS", "工控安全"]
        }
      ];

    case 5:
      return [
        {
          icon: "🔋",
          title: "储能系统全寿命管理",
          period: "2020-2025年",
          desc: "范飞龙等学者研究储能系统运行、寿命管理及健康感知，提出多阶段电池老化特性下的协调服务策略",
          keywords: ["储能管理", "电池寿命", "健康感知"]
        },
        {
          icon: "🤖",
          title: "电力设备智能诊断",
          period: "2025年",
          desc: "李喆教授团队的电力设备声音特征图谱及智能诊断入选电气人工智能科技创新先锋示范案例",
          keywords: ["AI诊断", "声学特征", "智能运维"]
        },
        {
          icon: "🌍",
          title: "新型电力系统研究",
          period: "2020-2025年",
          desc: "与国家电投共建智慧能源创新学院，突破新能源为主体的新型电力系统关键技术，推动能源转型",
          keywords: ["新型电力系统", "源网荷储", "能源转型"]
        }
      ];

    default:
      return [];
  }
}
