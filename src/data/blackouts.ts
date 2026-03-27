export interface BlackoutEvent {
  id: string;
  year: number;
  date: string;
  name: string;
  nameCn: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  affectedArea: string;
  affectedPeople: string;
  duration: string;
  cause: string;
  hook: string; // 一句话钩子
  act: number; // 所属幕 (1-5)
  slug: string; // URL 路径
}

export const blackoutEvents: BlackoutEvent[] = [
  // ===== 第一幕：脆弱与觉醒 =====
  {
    id: "1965-northeast",
    year: 1965,
    date: "1965-11-09",
    name: "Northeast Blackout",
    nameCn: "北美大停电",
    location: "美国东北部、加拿大安大略",
    coordinates: [-73.94, 40.67],
    affectedArea: "20万平方公里",
    affectedPeople: "3000万人",
    duration: "13小时",
    cause: "继电器保护误动作引发连锁故障",
    hook: "一个继电器，瘫痪一个大陆",
    act: 1,
    slug: "1965-northeast-blackout",
  },
  {
    id: "1977-nyc",
    year: 1977,
    date: "1977-07-13",
    name: "New York City Blackout",
    nameCn: "纽约大停电",
    location: "美国纽约市",
    coordinates: [-74.006, 40.7128],
    affectedArea: "纽约市全境",
    affectedPeople: "900万人",
    duration: "25小时",
    cause: "雷击引发连锁跳闸",
    hook: "黑暗中，人性的两面浮现",
    act: 1,
    slug: "1977-nyc-blackout",
  },

  // ===== 第二幕：自然之力 =====
  {
    id: "1989-quebec",
    year: 1989,
    date: "1989-03-13",
    name: "Quebec Blackout",
    nameCn: "加拿大魁北克大停电",
    location: "加拿大魁北克省",
    coordinates: [-71.21, 46.81],
    affectedArea: "魁北克全省",
    affectedPeople: "600万人",
    duration: "9小时",
    cause: "太阳风暴引发地磁感应电流",
    hook: "太阳打了个喷嚏，地球暗了",
    act: 2,
    slug: "1989-quebec-blackout",
  },
  {
    id: "2012-india",
    year: 2012,
    date: "2012-07-31",
    name: "India Blackout",
    nameCn: "印度大停电",
    location: "印度北部、东部、东北部",
    coordinates: [77.21, 28.61],
    affectedArea: "印度22个邦",
    affectedPeople: "6.7亿人",
    duration: "超过15小时",
    cause: "电网过负荷与区域间功率不平衡",
    hook: "6.7亿人，人类史上最大规模",
    act: 2,
    slug: "2012-india-blackout",
  },
  {
    id: "2016-south-australia",
    year: 2016,
    date: "2016-09-28",
    name: "South Australia Blackout",
    nameCn: "南澳大利亚大停电",
    location: "澳大利亚南澳州",
    coordinates: [138.6, -34.93],
    affectedArea: "南澳州全境",
    affectedPeople: "170万人",
    duration: "超过50小时（部分地区）",
    cause: "极端风暴导致输电线路连续跳闸",
    hook: "风暴与风电的博弈",
    act: 2,
    slug: "2016-south-australia-blackout",
  },

  // ===== 第三幕：连锁崩塌 =====
  {
    id: "2003-us-canada",
    year: 2003,
    date: "2003-08-14",
    name: "US-Canada Blackout",
    nameCn: "美加大停电",
    location: "美国东北部、加拿大安大略",
    coordinates: [-81.69, 41.5],
    affectedArea: "24万平方公里",
    affectedPeople: "5500万人",
    duration: "长达4天（部分地区）",
    cause: "输电线路触碰树枝引发级联故障",
    hook: "一棵树碰到一根线，5500万人的黑夜",
    act: 3,
    slug: "2003-us-canada-blackout",
  },
  {
    id: "2003-italy",
    year: 2003,
    date: "2003-09-28",
    name: "Italy Blackout",
    nameCn: "意大利大停电",
    location: "意大利全境",
    coordinates: [12.49, 41.9],
    affectedArea: "意大利全国",
    affectedPeople: "5600万人",
    duration: "12小时",
    cause: "瑞意联络线跳闸引发连锁",
    hook: "同一年，大洋彼岸的警钟",
    act: 3,
    slug: "2003-italy-blackout",
  },
  {
    id: "2006-europe",
    year: 2006,
    date: "2006-11-04",
    name: "European Blackout",
    nameCn: "欧洲大停电",
    location: "西欧多国",
    coordinates: [7.49, 51.43],
    affectedArea: "法、德、意、西等国",
    affectedPeople: "1500万人",
    duration: "约2小时",
    cause: "高压线路停运导致电网分裂",
    hook: "一条船过河，半个欧洲失电",
    act: 3,
    slug: "2006-europe-blackout",
  },

  // ===== 第四幕：新时代，新威胁 =====
  {
    id: "2015-ukraine",
    year: 2015,
    date: "2015-12-23",
    name: "Ukraine Power Grid Cyberattack",
    nameCn: "乌克兰电网遭黑客攻击",
    location: "乌克兰伊万诺-弗兰科夫斯克",
    coordinates: [24.71, 48.92],
    affectedArea: "乌克兰西部地区",
    affectedPeople: "23万人",
    duration: "6小时",
    cause: "BlackEnergy恶意软件远程攻击SCADA系统",
    hook: "电网，第一次被'入侵'",
    act: 4,
    slug: "2015-ukraine-cyberattack",
  },
  {
    id: "2019-argentina",
    year: 2019,
    date: "2019-06-16",
    name: "Argentina-Uruguay Blackout",
    nameCn: "阿根廷及乌拉圭大停电",
    location: "阿根廷、乌拉圭全境",
    coordinates: [-58.38, -34.6],
    affectedArea: "两国全境",
    affectedPeople: "4800万人",
    duration: "超过15小时",
    cause: "输电系统故障引发全网崩溃",
    hook: "一个国家，从电网地图上消失",
    act: 4,
    slug: "2019-argentina-blackout",
  },
  {
    id: "2019-uk",
    year: 2019,
    date: "2019-08-09",
    name: "UK 8·9 Blackout",
    nameCn: "英国8·9大停电",
    location: "英格兰、威尔士",
    coordinates: [-0.1276, 51.5074],
    affectedArea: "英格兰、威尔士大部",
    affectedPeople: "100万人",
    duration: "约45分钟",
    cause: "风电机组与燃气机组接连脱网",
    hook: "发达国家也不安全",
    act: 4,
    slug: "2019-uk-blackout",
  },
  {
    id: "2021-texas",
    year: 2021,
    date: "2021-02-15",
    name: "Texas Power Crisis",
    nameCn: "美国德州大停电",
    location: "美国德克萨斯州",
    coordinates: [-97.74, 30.27],
    affectedArea: "德州大部分地区",
    affectedPeople: "450万户",
    duration: "超过4天",
    cause: "极寒天气导致发电设备大面积冻结",
    hook: "冰封的孤岛，市场化的代价",
    act: 4,
    slug: "2021-texas-blackout",
  },

  // ===== 第五幕：此刻 =====
  {
    id: "2025-iberia",
    year: 2025,
    date: "2025-04-28",
    name: "Iberian Peninsula Blackout",
    nameCn: "伊比利亚半岛大停电",
    location: "西班牙、葡萄牙",
    coordinates: [-3.7, 40.42],
    affectedArea: "伊比利亚半岛全境",
    affectedPeople: "超过5000万人",
    duration: "约12小时",
    cause: "调查中",
    hook: "就在此刻——故事还没有结束",
    act: 5,
    slug: "2025-iberia-blackout",
  },
];

export interface ActInfo {
  act: number;
  title: string;
  subtitle: string;
  theme: string;
  bgDescription: string;
  sjtuWhisper: string;
}

export const acts: ActInfo[] = [
  {
    act: 1,
    title: "脆弱与觉醒",
    subtitle: "Fragility & Awakening",
    theme: "人类第一次直面电网的脆弱",
    bgDescription: "城市天际线剪影，窗户的灯逐个熄灭",
    sjtuWhisper: "1965年，交通大学电力系统研究正在扎根……",
  },
  {
    act: 2,
    title: "自然之力",
    subtitle: "Force of Nature",
    theme: "自然面前，人类的电网渺小如纸",
    bgDescription: "太阳风/极光粒子效果",
    sjtuWhisper: "交大电力团队在电网安全领域开始深耕……",
  },
  {
    act: 3,
    title: "连锁崩塌",
    subtitle: "Cascading Collapse",
    theme: "牵一发而动全身",
    bgDescription: "节点网络图，节点依次失效",
    sjtuWhisper: "中国电网高速发展，交大人参与大电网安全核心研究……",
  },
  {
    act: 4,
    title: "新时代，新威胁",
    subtitle: "New Era, New Threats",
    theme: "威胁在进化",
    bgDescription: "数字矩阵/glitch效果",
    sjtuWhisper: "新能源、网络安全——交大电气开辟新方向……",
  },
  {
    act: 5,
    title: "此刻",
    subtitle: "Right Now",
    theme: "故事还没有结束",
    bgDescription: "黑暗中微光渗透",
    sjtuWhisper: "而此刻，站在这里的，是我们……",
  },
];
