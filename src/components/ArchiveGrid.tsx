import { blackoutEvents } from "../data/blackouts";

// 为不同幕次定义配色
const actColors = {
  1: { border: "border-blue-200", bg: "bg-blue-50", accent: "text-blue-600" },
  2: { border: "border-green-200", bg: "bg-green-50", accent: "text-green-600" },
  3: { border: "border-orange-200", bg: "bg-orange-50", accent: "text-orange-600" },
  4: { border: "border-red-200", bg: "bg-red-50", accent: "text-red-600" },
  5: { border: "border-purple-200", bg: "bg-purple-50", accent: "text-purple-600" },
};

export default function ArchiveGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 标题区 */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-light text-gray-900 mb-4">
          全球停电档案馆
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Global Blackout Archive
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          60年，13次停电，人类与光明的博弈
        </p>
        <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
      </div>

      {/* 卡片网格 */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blackoutEvents.map((event) => {
            const colors = actColors[event.act as keyof typeof actColors];
            return (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className={`group block bg-white border-2 ${colors.border} p-6 rounded-xl
                           hover:shadow-xl hover:border-gray-400 transition-all duration-300
                           hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} rounded-bl-full opacity-50`}></div>

                {/* 年份 */}
                <div className={`text-4xl font-light ${colors.accent} mb-3 relative z-10`}>
                  {event.year}
                </div>

                {/* 名称 */}
                <h3 className="text-base font-medium text-gray-800 mb-1 relative z-10">
                  {event.nameCn}
                </h3>
                <p className="text-xs text-gray-500 mb-3 relative z-10">
                  {event.name}
                </p>

                {/* 地点 */}
                <p className="text-sm text-gray-600 mb-3 relative z-10">
                  📍 {event.location}
                </p>

                {/* Hook */}
                <p className={`text-sm text-gray-700 italic border-l-2 ${colors.border} pl-3 relative z-10`}>
                  {event.hook}
                </p>

                {/* Hover提示 */}
                <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition-colors relative z-10">
                  查看详情 →
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 底部致谢区域 */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">致谢</h2>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            感谢上海交通大学电气工程系的师生们，数十年如一日地守护着电网安全，
            为人类的光明事业贡献智慧与力量。
          </p>
          <p className="text-xs text-gray-500">
            © 2026 全球停电档案馆 · 上海交通大学电气工程系
          </p>
        </div>
      </div>
    </div>
  );
}
