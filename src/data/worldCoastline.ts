/**
 * 简化世界海岸线 SVG path 数据
 * 等距圆柱投影 (Equirectangular)，viewBox: 0 0 1000 500
 * 仅海岸线，无国境线
 *
 * 坐标转换公式:
 *   x = (lng + 180) / 360 * 1000
 *   y = (90 - lat) / 180 * 500
 *
 * 参考校验点:
 *   New York  (-74, 40.7)   → (294, 137)
 *   London    (-0.1, 51.5)  → (500, 107)
 *   Tokyo     (139.7, 35.7) → (888, 151)
 *   Sydney    (151.2, -33.9)→ (920, 344)
 *   Buenos Aires (-58.4,-34.6)→(338, 346)
 *   New Delhi (77.2, 28.6)  → (715, 171)
 */
export const continentPaths: string[] = [
  // ── North America (including Central America) ──
  // Starts NW Alaska, goes along Pacific coast south to Panama,
  // then Atlantic coast north through Florida, east coast, Newfoundland,
  // up through Canadian Arctic back to Alaska.
  [
    "M 33,69",    // NW Alaska
    "L 28,78",    // Alaska north coast
    "L 42,82",    // north Alaska
    "L 60,80",    // Beaufort Sea coast
    "L 100,82",   // NW Territories coast
    "L 150,83",   // Canadian Arctic coast
    "L 210,82",   // Baffin Island west
    "L 250,75",   // Hudson Strait area
    "L 264,75",   // Hudson Bay north
    "L 258,90",   // Hudson Bay west
    "L 250,105",  // Hudson Bay south
    "L 264,95",   // Hudson Bay east
    "L 275,85",   // Ungava
    "L 300,80",   // Labrador
    "L 335,85",   // Labrador coast
    "L 354,118",  // Newfoundland
    "L 340,110",  // Nova Scotia
    "L 314,125",  // Maine
    "L 294,137",  // New York
    "L 287,145",  // mid-Atlantic
    "L 282,155",  // Carolinas
    "L 278,168",  // Georgia coast
    "L 277,179",  // Florida tip
    "L 272,172",  // Florida west coast
    "L 260,175",  // Gulf panhandle
    "L 240,176",  // Gulf coast Louisiana
    "L 230,181",  // Texas coast
    "L 225,192",  // south Texas
    "L 215,195",  // Mexico Gulf coast
    "L 223,210",  // Veracruz area
    "L 240,213",  // Yucatan NE
    "L 237,220",  // Yucatan SE
    "L 255,218",  // Belize
    "L 265,222",  // Honduras
    "L 279,225",  // Panama
    "L 274,230",  // Panama Pacific side
    "L 265,220",  // Costa Rica Pacific
    "L 253,218",  // Nicaragua Pacific
    "L 240,226",  // Guatemala Pacific
    "L 225,205",  // Mexico Pacific (Oaxaca)
    "L 210,200",  // Mexico Pacific (Acapulco)
    "L 195,186",  // Baja tip
    "L 188,170",  // Baja mid
    "L 180,162",  // Baja north / Tijuana
    "L 172,155",  // LA area
    "L 160,145",  // San Francisco
    "L 156,132",  // Oregon
    "L 158,118",  // Vancouver
    "L 148,110",  // BC coast
    "L 120,102",  // SE Alaska
    "L 95,100",   // Gulf of Alaska
    "L 60,96",    // Alaska Peninsula
    "L 42,97",    // Aleutians area
    "L 33,86",    // SW Alaska
    "Z",
  ].join(" "),

  // ── South America ──
  [
    "M 274,230",  // NW Colombia (Panama border)
    "L 284,222",  // Colombia Caribbean coast
    "L 299,218",  // Venezuela coast
    "L 314,221",  // Venezuela east
    "L 330,217",  // Guyana/Suriname
    "L 350,218",  // French Guiana
    "L 362,228",  // Amapa, Brazil
    "L 372,237",  // Para coast
    "L 389,245",  // Maranhao
    "L 400,255",  // Ceara
    "L 403,273",  // Recife
    "L 396,290",  // Bahia
    "L 388,303",  // Espirito Santo
    "L 380,314",  // Rio de Janeiro
    "L 365,325",  // Sao Paulo coast
    "L 350,338",  // Parana coast
    "L 338,346",  // Buenos Aires
    "L 330,358",  // Bahia Blanca
    "L 320,372",  // Patagonia
    "L 312,388",  // Patagonia south
    "L 310,402",  // Tierra del Fuego
    "L 300,402",  // Tierra del Fuego west
    "L 296,390",  // Southern Chile
    "L 288,375",  // Chile
    "L 286,360",  // Chile mid
    "L 282,340",  // Chile (Santiago area)
    "L 280,318",  // Chile north
    "L 278,300",  // Atacama
    "L 282,283",  // Peru (Lima)
    "L 280,265",  // Peru north
    "L 278,252",  // Ecuador
    "L 282,250",  // Ecuador coast
    "L 280,240",  // Colombia Pacific
    "Z",
  ].join(" "),

  // ── Europe + Western Russia (Eurasia western coastline) ──
  // Traces from Portugal along Atlantic/Mediterranean/Scandinavia/Arctic
  [
    "M 475,143",  // Portugal west coast
    "L 480,148",  // Portugal south
    "L 485,150",  // Gibraltar area
    "L 492,149",  // S Spain Med coast
    "L 502,148",  // SE Spain
    "L 510,147",  // Balearics area
    "L 518,148",  // S France coast
    "L 525,147",  // French Riviera
    "L 530,146",  // NW Italy (Genoa)
    "L 535,149",  // W Italy
    "L 537,155",  // Rome area
    "L 540,160",  // S Italy
    "L 543,155",  // SE Italy (Puglia)
    "L 548,152",  // Albania/Greece west
    "L 553,148",  // Greece west
    "L 558,152",  // Peloponnese
    "L 564,149",  // Greece south
    "L 570,146",  // Aegean
    "L 576,140",  // NE Greece/Thrace
    "L 581,136",  // Istanbul area
    "L 575,135",  // Bulgaria coast
    "L 570,128",  // Romania coast
    "L 576,125",  // Crimea
    "L 582,127",  // Crimea east
    "L 588,120",  // Sea of Azov
    "L 596,115",  // Southern Russia
    "L 610,108",  // Caspian north area / Russia
    "L 590,100",  // Central Russia
    "L 570,92",   // Northern Russia
    "L 552,80",   // Kola Peninsula area
    "L 547,53",   // N Norway
    "L 538,60",   // Norway mid
    "L 530,68",   // Norway west coast
    "L 520,74",   // Norway south
    "L 516,80",   // Sweden west
    "L 520,92",   // Denmark area
    "L 518,96",   // Germany north coast
    "L 524,100",  // Denmark
    "L 518,102",  // Netherlands/Belgium
    "L 514,108",  // Germany Bight
    "L 510,106",  // Netherlands
    "L 505,112",  // Belgium/France
    "L 496,118",  // Brittany
    "L 492,126",  // Bay of Biscay
    "L 488,132",  // N Spain
    "L 480,138",  // NW Spain (Galicia)
    "L 475,143",  // back to Portugal
    "Z",
  ].join(" "),

  // ── Africa ──
  [
    "M 483,150",  // Morocco NW (Strait of Gibraltar)
    "L 478,155",  // Morocco Atlantic coast
    "L 471,165",  // Morocco south
    "L 465,175",  // Western Sahara
    "L 458,190",  // Mauritania
    "L 452,209",  // Senegal/Dakar
    "L 456,215",  // Gambia
    "L 452,222",  // Guinea
    "L 460,228",  // Sierra Leone/Liberia
    "L 475,230",  // Ivory Coast
    "L 490,232",  // Ghana
    "L 504,230",  // Togo/Benin
    "L 509,232",  // Lagos/Nigeria
    "L 518,235",  // Nigeria coast
    "L 524,240",  // Cameroon
    "L 526,248",  // Equatorial Guinea/Gabon
    "L 528,260",  // Congo coast
    "L 530,275",  // Angola north
    "L 532,290",  // Angola
    "L 534,306",  // Angola/Namibia border
    "L 536,318",  // Namibia coast
    "L 540,332",  // Namibia south
    "L 548,340",  // South Africa west coast
    "L 551,344",  // Cape Town
    "L 560,346",  // Cape Agulhas
    "L 572,342",  // South Africa south coast
    "L 582,338",  // Port Elizabeth
    "L 590,332",  // East London
    "L 595,320",  // Durban
    "L 598,310",  // Mozambique south
    "L 600,300",  // Mozambique
    "L 598,285",  // Mozambique channel
    "L 600,270",  // Tanzania south
    "L 604,260",  // Tanzania
    "L 610,252",  // Tanzania/Kenya
    "L 618,240",  // Kenya coast
    "L 624,230",  // Somalia south
    "L 632,222",  // Somalia east
    "L 640,218",  // Horn of Africa
    "L 635,215",  // Djibouti
    "L 628,210",  // Eritrea
    "L 618,200",  // Red Sea coast
    "L 608,188",  // Sudan Red Sea
    "L 600,175",  // Egypt Red Sea
    "L 595,163",  // Sinai area
    "L 590,158",  // Egypt Med coast (east)
    "L 575,155",  // Libya east coast
    "L 558,153",  // Libya west coast
    "L 545,152",  // Tunisia east
    "L 528,148",  // Tunisia/Algeria coast
    "L 510,148",  // Algeria coast
    "L 495,149",  // Morocco Med coast
    "L 483,150",  // back to Morocco NW
    "Z",
  ].join(" "),

  // ── Asia (main landmass) ──
  // From Turkey/Middle East around to Kamchatka, down through East/SE Asia
  [
    "M 581,136",  // Istanbul/Turkey NW
    "L 588,140",  // Turkey north coast
    "L 600,138",  // Turkey NE
    "L 612,135",  // Georgia/Black Sea
    "L 620,128",  // Caucasus
    "L 630,120",  // Caspian west
    "L 640,115",  // Caspian north
    "L 650,105",  // Kazakhstan/Russia
    "L 670,97",   // Russia (Urals east)
    "L 700,90",   // W Siberia
    "L 740,85",   // Central Siberia
    "L 780,80",   // E Siberia
    "L 820,75",   // NE Siberia
    "L 860,72",   // Chukotka area
    "L 900,75",   // NE Russia
    "L 930,80",   // Kamchatka north
    "L 950,94",   // Kamchatka
    "L 940,100",  // Kamchatka west
    "L 928,108",  // Sea of Okhotsk
    "L 910,115",  // Sakhalin area
    "L 898,125",  // Primorsky / Vladivostok
    "L 882,135",  // North Korea
    "L 870,147",  // Korea west coast
    "L 858,153",  // Korea south
    "L 850,158",  // China (Shanghai approach)
    "L 838,163",  // Shanghai
    "L 830,172",  // SE China
    "L 822,182",  // Fujian
    "L 816,195",  // Guangdong
    "L 808,208",  // Hainan area
    "L 800,218",  // Vietnam north
    "L 796,226",  // Vietnam south
    "L 790,235",  // Vietnam tip
    "L 786,240",  // Malay Peninsula north
    "L 780,248",  // Thailand/Malaysia border
    "L 775,258",  // Malaysia
    "L 778,265",  // Malaysia south / Singapore
    "L 785,258",  // E Malaysia coast (bounce back up)
    "L 790,248",  // Gulf of Thailand east
    "L 795,240",  // Cambodia coast
    // back to main body through Myanmar/India
    "L 778,240",  // Myanmar south
    "L 770,232",  // Myanmar coast
    "L 758,222",  // Myanmar
    "L 750,215",  // Bangladesh
    "L 742,210",  // Bangladesh/India
    "L 735,200",  // India NE coast (Kolkata)
    "L 728,192",  // Odisha
    "L 722,200",  // Andhra Pradesh
    "L 718,210",  // SE India
    "L 715,228",  // India south tip
    "L 710,218",  // Kerala coast
    "L 706,205",  // Karnataka coast
    "L 702,197",  // Mumbai
    "L 698,185",  // Gujarat
    "L 690,178",  // Gujarat north
    "L 680,175",  // Pakistan coast
    "L 670,172",  // Pakistan/Iran border
    "L 658,168",  // Iran south coast
    "L 645,170",  // Iran/Persian Gulf
    "L 638,172",  // Persian Gulf
    "L 628,173",  // Qatar/UAE area
    "L 622,178",  // Oman
    "L 628,185",  // Oman east
    "L 632,195",  // Oman south
    "L 630,205",  // Yemen east
    "L 625,215",  // Yemen/Aden
    "L 616,198",  // Red Sea / Yemen
    "L 608,188",  // connects to Africa boundary / Red Sea
    "L 600,175",  // Sinai east
    "L 595,163",  // Israel/Lebanon coast
    "L 590,157",  // Syria coast
    "L 584,148",  // Turkey south coast
    "L 581,136",  // back to Istanbul
    "Z",
  ].join(" "),

  // ── Australia ──
  [
    "M 863,285",  // Darwin area (N coast)
    "L 875,280",  // Arnhem Land
    "L 890,278",  // Gulf of Carpentaria east
    "L 896,280",  // Cape York
    "L 900,288",  // Queensland NE
    "L 910,300",  // Queensland coast
    "L 920,315",  // Queensland south
    "L 925,326",  // Brisbane area
    "L 922,336",  // NSW coast
    "L 918,344",  // Sydney area
    "L 910,350",  // Victoria east
    "L 903,355",  // Melbourne
    "L 893,354",  // Victoria west
    "L 883,356",  // SA south coast
    "L 870,354",  // Great Australian Bight
    "L 855,354",  // Bight mid
    "L 840,350",  // Bight west
    "L 830,345",  // WA south coast
    "L 822,339",  // Perth area
    "L 818,328",  // WA SW
    "L 816,315",  // WA west coast
    "L 820,300",  // Shark Bay area
    "L 825,288",  // North West Cape
    "L 833,278",  // Pilbara
    "L 842,275",  // WA Kimberley
    "L 853,278",  // Kimberley east
    "L 863,285",  // back to Darwin
    "Z",
  ].join(" "),

  // ── Greenland ──
  [
    "M 378,83",   // S Greenland
    "L 370,72",   // SW Greenland
    "L 365,55",   // W Greenland
    "L 372,38",   // NW Greenland
    "L 385,25",   // N Greenland
    "L 400,20",   // NE Greenland
    "L 408,30",   // E Greenland north
    "L 405,45",   // E Greenland mid
    "L 398,60",   // E Greenland
    "L 390,72",   // SE Greenland
    "L 378,83",   // back to S Greenland
    "Z",
  ].join(" "),

  // ── Japan (simplified) ──
  [
    "M 895,128",  // Hokkaido N
    "L 900,124",  // Hokkaido NE
    "L 898,130",  // Hokkaido SE
    "L 892,134",  // Hokkaido SW / Strait
    "L 888,138",  // N Honshu (Aomori)
    "L 886,145",  // Honshu mid
    "L 888,151",  // Tokyo area
    "L 884,156",  // Honshu SW
    "L 878,158",  // Shikoku / W Honshu
    "L 872,160",  // Kyushu NE
    "L 864,163",  // Kyushu S
    "L 870,158",  // Kyushu W returning
    "L 876,154",  // W Honshu Sea of Japan side
    "L 880,148",  // Honshu mid Sea of Japan
    "L 884,140",  // N Honshu Sea of Japan
    "L 890,132",  // Hokkaido W
    "L 895,128",  // back to Hokkaido N
    "Z",
  ].join(" "),

  // ── Indonesian Archipelago - Borneo (simplified) ──
  [
    "M 810,260",  // Borneo NW
    "L 822,256",  // Borneo NE
    "L 828,265",  // Borneo E
    "L 822,278",  // Borneo SE
    "L 812,280",  // Borneo S
    "L 802,272",  // Borneo SW
    "L 805,264",  // Borneo W
    "L 810,260",  // close
    "Z",
  ].join(" "),

  // ── Indonesian Archipelago - Sumatra (simplified) ──
  [
    "M 770,265",  // Sumatra N
    "L 778,270",  // Sumatra NE
    "L 782,280",  // Sumatra E
    "L 778,292",  // Sumatra SE
    "L 770,296",  // Sumatra S
    "L 764,288",  // Sumatra SW
    "L 766,276",  // Sumatra W
    "L 770,265",  // close
    "Z",
  ].join(" "),

  // ── New Zealand (simplified) ──
  [
    // North Island
    "M 940,365",
    "L 945,360",
    "L 948,368",
    "L 944,375",
    "L 938,372",
    "L 940,365",
    "Z",
  ].join(" "),

  // ── New Zealand South Island ──
  [
    "M 940,378",
    "L 946,375",
    "L 948,385",
    "L 944,393",
    "L 938,390",
    "L 936,382",
    "L 940,378",
    "Z",
  ].join(" "),
];
