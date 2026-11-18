const rng = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const rg = (id, a, b) =>
  `<radialGradient id='${id}' cx='.35' cy='.3' r='.85'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></radialGradient>`;
const lg = (id, a, b) =>
  `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient>`;
const TONE = {
  w: ["#f5efe6", "#e2d5bf"],
  c: ["#eaf2fc", "#cfe0f4"],
  p: ["#fbf1f3", "#eedbe1"],
  s: ["#f7f1e2", "#e6d9b6"],
};
const wrap = (t, body, defs = "") =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'><defs>${lg("bg", ...TONE[t])}<filter id='sh' x='-30%' y='-30%' width='160%' height='180%'><feGaussianBlur stdDeviation='3.5'/></filter>${defs}</defs><rect width='200' height='150' fill='url(#bg)'/>${body}</svg>`;
const sh = (cx, cy, rx, ry) =>
  `<ellipse cx='${cx}' cy='${cy}' rx='${rx}' ry='${ry}' fill='#000' opacity='.2' filter='url(#sh)'/>`;
const plate = () =>
  sh(100, 100, 78, 34) +
  `<ellipse cx='100' cy='92' rx='78' ry='34' fill='#fff'/><ellipse cx='100' cy='92' rx='72' ry='30' fill='none' stroke='#e4e0d8' stroke-width='1.5'/><ellipse cx='100' cy='93' rx='58' ry='22' fill='#f6f3ee'/>`;
const scatter = (n, cx, cy, rx, ry, r, cols, seed) => {
  const q = rng(seed || 7);
  let o = "";
  for (let i = 0; i < n; i++) {
    const a = q() * 6.283,
      d = Math.sqrt(q()),
      x = cx + Math.cos(a) * rx * d,
      y = cy + Math.sin(a) * ry * d;
    o += `<ellipse cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' rx='${(r * (0.6 + q() * 0.8)).toFixed(1)}' ry='${(r * 0.55 * (0.6 + q() * 0.8)).toFixed(1)}' fill='${cols[Math.floor(q() * cols.length)]}'/>`;
  }
  return o;
};
const BW = lg("bw", "#ffffff", "#c5d2e3");
const bowl = (inner) =>
  sh(100, 114, 72, 16) +
  `<path d='M32 76 Q36 124 100 126 Q164 124 168 76Z' fill='url(#bw)'/><ellipse cx='100' cy='76' rx='68' ry='22' fill='#fbfaf7' stroke='#d9dee6'/>` +
  inner;
const snack = (kind) => {
  const P = [
    [76, 84, -18],
    [108, 80, 12],
    [94, 100, 4],
    [132, 98, -12],
  ];
  const shape = {
    dumpling: `<path d='M-17 4 q17 -26 34 0 q-17 9 -34 0z' fill='url(#g)'/>`,
    tofu: `<rect x='-13' y='-13' width='26' height='26' rx='7' fill='url(#g)'/>`,
    cassava: `<rect x='-24' y='-5' width='48' height='10' rx='5' fill='url(#g)'/>`,
    banana: `<ellipse rx='22' ry='9' fill='url(#g)'/>`,
  }[kind];
  const cs = kind === "cassava";
  return wrap(
    "s",
    plate() +
      P.map(
        ([x, y, r], i) =>
          `<g transform='translate(${x} ${y}) rotate(${r + (cs ? i * 20 : 0)})'>${shape}${scatter(14, 0, 0, 12, 5, 1.4, ["#fbe4a0", "#c07a22"], x + y)}</g>`,
      ).join("") +
      (kind === "dumpling" || kind === "tofu"
        ? `<ellipse cx='150' cy='108' rx='14' ry='6' fill='#d33a2c'/><ellipse cx='148' cy='107' rx='8' ry='3' fill='#f0705a' opacity='.7'/>`
        : ""),
    rg("g", cs ? "#f6dc94" : "#f1bd55", cs ? "#d9a54a" : "#bf7a1c"),
  );
};
const cupDefs = (a, b) => lg("cw", "#ffffff", "#d6dde8") + rg("lq", a, b);
const cup = (art, steam, tag) =>
  sh(100, 114, 64, 12) +
  `<ellipse cx='100' cy='106' rx='64' ry='20' fill='#fff'/><ellipse cx='100' cy='106' rx='52' ry='14' fill='none' stroke='#e1e5ec'/><path d='M146 80 q26 2 20 22 q-4 12 -24 8' fill='none' stroke='#fff' stroke-width='7' stroke-linecap='round'/><path d='M52 66 h96 q0 44 -48 46 q-48 -2 -48 -46z' fill='url(#cw)'/><ellipse cx='100' cy='66' rx='48' ry='14' fill='#f3f5f8'/><ellipse cx='100' cy='67' rx='42' ry='10.5' fill='url(#lq)'/>` +
  art +
  (steam
    ? [82, 100, 118]
        .map(
          (x) =>
            `<path d='M${x} 50 q-8 -10 0 -18 t0 -18' fill='none' stroke='#fff' stroke-width='3' stroke-linecap='round' opacity='.75'/>`,
        )
        .join("")
    : "") +
  (tag
    ? `<path d='M120 62 q22 -4 30 10' fill='none' stroke='#999' stroke-width='1'/><rect x='144' y='68' width='14' height='10' rx='2' fill='#fff' stroke='#c9ced8'/>`
    : "");
const GL = "M66 28 H134 L125 126 Q124 134 116 134 H84 Q76 134 75 126Z";
const glass = (layers, extra = "", straw = "#e8506e") =>
  sh(100, 138, 36, 6) +
  `<clipPath id='gc'><path d='${GL}'/></clipPath><line x1='108' y1='12' x2='96' y2='104' stroke='${straw}' stroke-width='5' stroke-linecap='round'/><path d='${GL}' fill='#fff' opacity='.28'/><g clip-path='url(#gc)'>` +
  layers
    .map(
      ([y, h, c]) =>
        `<rect x='60' y='${y}' width='80' height='${h}' fill='${c}'/>`,
    )
    .join("") +
  [
    [84, 60, -12],
    [108, 52, 10],
    [94, 84, 22],
    [112, 100, -18],
  ]
    .map(
      ([x, y, r]) =>
        `<rect x='${x - 9}' y='${y - 9}' width='18' height='18' rx='4' fill='#fff' opacity='.5' stroke='#fff' stroke-opacity='.7' transform='rotate(${r} ${x} ${y})'/>`,
    )
    .join("") +
  `</g><path d='${GL}' fill='none' stroke='#fff' stroke-width='2' opacity='.85'/><path d='M80 40 L84 118' stroke='#fff' stroke-width='3' opacity='.55' stroke-linecap='round'/>` +
  extra;
const slice = (x, y, c1, c2) =>
  `<circle cx='${x}' cy='${y}' r='15' fill='${c1}'/><circle cx='${x}' cy='${y}' r='11' fill='${c2}'/><path d='M${x} ${y - 11} V${y + 11} M${x - 11} ${y} H${x + 11} M${x - 8} ${y - 8} L${x + 8} ${y + 8} M${x + 8} ${y - 8} L${x - 8} ${y + 8}' stroke='${c1}' stroke-width='1.2'/>`;
const dot = (x, y) =>
  `<circle cx='${x}' cy='${y}' r='7' fill='#7fb35a'/><circle cx='${x}' cy='${y}' r='4.5' fill='#dcefc6'/>`;
const ART = {
  rice: () =>
    wrap(
      "w",
      plate() +
        `<ellipse cx='92' cy='86' rx='42' ry='23' fill='url(#a)'/>` +
        scatter(
          130,
          92,
          85,
          38,
          18,
          2.3,
          ["#c58a2c", "#e6bb62", "#8e531b", "#f3d98f", "#6aa84f"],
          3,
        ) +
        `<ellipse cx='141' cy='99' rx='21' ry='11' fill='#fff'/><ellipse cx='141' cy='98' rx='8' ry='6' fill='url(#y)'/>` +
        dot(62, 104) +
        dot(76, 109),
      rg("a", "#ebbd64", "#a8691f") + rg("y", "#ffd84a", "#f08a00"),
    ),
  noodle: () =>
    wrap(
      "w",
      bowl(
        `<ellipse cx='100' cy='78' rx='58' ry='16' fill='#e9b04a'/>` +
          [0, 5, 10, 15]
            .map(
              (i) =>
                `<path d='M${52 + i} ${72 + i / 2} q10 -9 20 0 t20 0 t20 0 t20 0' fill='none' stroke='#f4d682' stroke-width='3.2' stroke-linecap='round'/>`,
            )
            .join("") +
          [
            [78, 76],
            [104, 80],
            [124, 74],
            [92, 84],
          ]
            .map(
              ([x, y]) =>
                `<rect x='${x}' y='${y}' width='14' height='8' rx='3' fill='#8b4a1e'/><rect x='${x + 2}' y='${y + 1}' width='6' height='2' rx='1' fill='#b96b30'/>`,
            )
            .join("") +
          `<ellipse cx='68' cy='80' rx='9' ry='5' fill='#5e9c3f'/>` +
          scatter(26, 100, 78, 50, 13, 1.8, ["#3f8f3a", "#79bd4d"], 5),
      ),
      BW,
    ),
  chicken: () =>
    wrap(
      "s",
      plate() +
        `<ellipse cx='62' cy='90' rx='22' ry='12' fill='#fffdf8'/>` +
        scatter(30, 62, 89, 18, 8, 1.4, ["#eadfc8", "#ffffff"], 2) +
        [
          [104, 84, -12],
          [132, 92, 10],
        ]
          .map(
            ([x, y, r]) =>
              `<g transform='translate(${x} ${y}) rotate(${r})'><ellipse rx='26' ry='14' fill='url(#f)'/>${scatter(40, 0, 0, 23, 11, 2, ["#d79a35", "#f0c36a", "#a86a1f"], x)}</g>`,
          )
          .join("") +
        `<ellipse cx='116' cy='102' rx='14' ry='6' fill='#c62d2d'/>` +
        scatter(16, 116, 102, 12, 4, 1.2, ["#ffd0a0", "#8a1b1b"], 4) +
        dot(60, 108) +
        dot(72, 111),
      rg("f", "#f3c56b", "#b8741f"),
    ),
  soup: () =>
    wrap(
      "w",
      bowl(
        `<ellipse cx='100' cy='78' rx='58' ry='16' fill='#f1c13f'/><ellipse cx='100' cy='76' rx='40' ry='10' fill='#f6d76a' opacity='.7'/>` +
          [
            [78, 76],
            [116, 78],
          ]
            .map(
              ([x, y]) =>
                `<ellipse cx='${x}' cy='${y}' rx='11' ry='7' fill='#fff'/><ellipse cx='${x}' cy='${y}' rx='5' ry='3.6' fill='#f6a313'/>`,
            )
            .join("") +
          scatter(
            30,
            100,
            78,
            50,
            12,
            1.8,
            ["#4c9a3a", "#a65f2a", "#e8d9a8"],
            9,
          ) +
          `<path d='M62 74 q8 -6 14 0 q-6 6 -14 0z' fill='#6fb24b'/>`,
      ),
      BW,
    ),
  skewer: () =>
    wrap(
      "w",
      plate() +
        [0, 1, 2]
          .map(
            (i) =>
              `<g transform='rotate(-8 100 ${80 + i * 13})'><line x1='36' y1='${74 + i * 14}' x2='170' y2='${74 + i * 14}' stroke='#d6b27a' stroke-width='2.6' stroke-linecap='round'/>` +
              [0, 1, 2, 3, 4]
                .map(
                  (j) =>
                    `<rect x='${58 + j * 18}' y='${68 + i * 14}' width='16' height='12' rx='5' fill='url(#m)'/><rect x='${61 + j * 18}' y='${70 + i * 14}' width='8' height='3' rx='1.5' fill='#d78b4c' opacity='.7'/>`,
                )
                .join("") +
              `</g>`,
          )
          .join("") +
        `<ellipse cx='150' cy='110' rx='18' ry='7' fill='#7d4b1d'/><ellipse cx='150' cy='108.5' rx='14' ry='4.5' fill='#a46a2c'/>`,
      rg("m", "#a45a25", "#5a2c10"),
    ),
  rendang: () =>
    wrap(
      "w",
      plate() +
        `<ellipse cx='70' cy='90' rx='26' ry='14' fill='#fffdf8'/>` +
        scatter(36, 70, 89, 22, 10, 1.4, ["#ece3cf", "#ffffff"], 6) +
        [
          [110, 82],
          [134, 92],
          [112, 100],
        ]
          .map(
            ([x, y], i) =>
              `<rect x='${x - 14}' y='${y - 9}' width='28' height='18' rx='8' fill='url(#rd)' transform='rotate(${i * 14 - 10} ${x} ${y})'/>`,
          )
          .join("") +
        scatter(
          40,
          118,
          92,
          30,
          14,
          1.3,
          ["#3a1b0c", "#a0602a", "#7a3d17"],
          8,
        ) +
        `<ellipse cx='102' cy='104' rx='6' ry='2.5' fill='#d83a2d'/><ellipse cx='144' cy='82' rx='6' ry='2.5' fill='#d83a2d'/>`,
      rg("rd", "#8a4720", "#3e1d0b"),
    ),
  salad: () =>
    wrap(
      "w",
      plate() +
        [
          [70, 88],
          [96, 78],
          [124, 86],
          [88, 98],
          [116, 98],
        ]
          .map(
            ([x, y], i) =>
              `<ellipse cx='${x}' cy='${y}' rx='20' ry='11' fill='${["#6faf48", "#88c25a", "#5c9e3c", "#7db84f", "#97cb67"][i]}' transform='rotate(${i * 30} ${x} ${y})'/>`,
          )
          .join("") +
        `<circle cx='140' cy='94' r='8' fill='#e04a3a'/><circle cx='137' cy='91' r='2.5' fill='#fff' opacity='.6'/><ellipse cx='86' cy='90' rx='13' ry='9' fill='#fff'/><ellipse cx='86' cy='90' rx='6' ry='4.5' fill='#f6b21b'/>` +
        [
          [108, 92],
          [60, 98],
        ]
          .map(
            ([x, y]) =>
              `<rect x='${x}' y='${y}' width='12' height='12' rx='3' fill='#e3b45c'/>`,
          )
          .join("") +
        `<path d='M56 84 q22 -16 48 -4 t46 6' fill='none' stroke='#a8692a' stroke-width='5' stroke-linecap='round' opacity='.9'/>`,
    ),
  pasta: () =>
    wrap(
      "w",
      plate() +
        [0, 1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<ellipse cx='100' cy='88' rx='${42 - i * 5}' ry='${19 - i * 2}' fill='none' stroke='${i % 2 ? "#f0cb68" : "#e5b84f"}' stroke-width='4' transform='rotate(${i * 25} 100 88)'/>`,
          )
          .join("") +
        `<ellipse cx='100' cy='84' rx='22' ry='10' fill='url(#sa)'/>` +
        scatter(18, 100, 83, 18, 7, 2, ["#7a2217", "#a8361f"], 4) +
        `<path d='M94 78 q6 -14 14 -4 q-4 10 -14 4z' fill='#4f9a3a'/>`,
      rg("sa", "#e0523c", "#a5281a"),
    ),
  burger: () =>
    wrap(
      "w",
      sh(100, 122, 64, 9) +
        `<path d='M42 102 h116 q0 18 -22 18 h-72 q-22 0 -22 -18z' fill='url(#bn)'/><rect x='38' y='88' width='124' height='16' rx='8' fill='#5a2e17'/><rect x='42' y='90' width='60' height='4' rx='2' fill='#7b4426' opacity='.8'/><path d='M40 86 h120 l-10 14 l-14 -9 l-12 11 l-12 -11 l-14 9 l-14 -9 l-12 9z' fill='#f6c230'/><path d='M36 80 q8 -10 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v8 h-96z' fill='#6bb04a'/><rect x='40' y='74' width='120' height='9' rx='4' fill='#d9402f'/><path d='M40 74 q0 -40 60 -40 q60 0 60 40z' fill='url(#bt)'/>` +
        scatter(18, 100, 52, 34, 12, 2.2, ["#fff3cf", "#f3deaa"], 11),
      rg("bn", "#e8a64d", "#b8701f") + rg("bt", "#f2b85a", "#b3661a"),
    ),
  dumpling: () => snack("dumpling"),
  tofu: () => snack("tofu"),
  cassava: () => snack("cassava"),
  banana: () => snack("banana"),
  fries: () =>
    wrap(
      "s",
      sh(100, 134, 42, 7) +
        Array.from(
          { length: 15 },
          (_, i) =>
            `<rect x='${72 + i * 3.7}' y='${52 + ((i * 7) % 5) * 4}' width='5.5' height='${48 - ((i * 7) % 5) * 2}' rx='2' fill='${i % 3 ? "#f4c93f" : "#e9b52c"}' transform='rotate(${(i - 7) * 3.4} ${75 + i * 3.7} 96)'/>`,
        ).join("") +
        `<path d='M70 92 h60 l-8 40 q-1 4 -5 4 h-34 q-4 0 -5 -4z' fill='url(#cp)'/><path d='M76 92 h12 l-2 44 h-10z' fill='#fff' opacity='.85'/><path d='M110 92 h12 l-4 44 h-12z' fill='#fff' opacity='.85'/>`,
      lg("cp", "#e63b36", "#b81e1e"),
    ),
  toast: () =>
    wrap(
      "s",
      plate() +
        [
          [82, 88, -8],
          [120, 92, 9],
        ]
          .map(
            ([x, y, r]) =>
              `<g transform='translate(${x} ${y}) rotate(${r})'><rect x='-30' y='-22' width='60' height='44' rx='13' fill='#c98e4a'/><rect x='-25' y='-17' width='50' height='34' rx='9' fill='#f4dba8'/><path d='M-22 -8 q8 -8 16 0 t16 0 t16 0 M-22 4 q8 -8 16 0 t16 0 t16 0' fill='none' stroke='#4a2616' stroke-width='3.6' stroke-linecap='round'/></g>`,
          )
          .join(""),
    ),
  americano: () =>
    wrap(
      "c",
      cup(
        `<ellipse cx='100' cy='67' rx='40' ry='9' fill='none' stroke='#a8713c' stroke-width='2' opacity='.6'/>`,
        true,
      ),
      cupDefs("#7a4a26", "#2a1409"),
    ),
  capp: () =>
    wrap(
      "c",
      cup(
        `<path d='M100 74 c-14 -8 -16 -16 -8 -18 c4 -1 8 2 8 5 c0 -3 4 -6 8 -5 c8 2 6 10 -8 18z' fill='#fff8ec'/>`,
        true,
      ),
      cupDefs("#e9cfa4", "#b98550"),
    ),
  teahot: () => wrap("c", cup("", true, true), cupDefs("#e0a13d", "#a8601a")),
  icedcoffee: () =>
    wrap(
      "c",
      glass([
        [44, 28, "#6d3d1f"],
        [72, 16, "#b98b62"],
        [88, 50, "#f6ecda"],
      ]),
    ),
  icedtea: () =>
    wrap(
      "c",
      glass(
        [
          [44, 92, "#c8782a"],
          [44, 12, "#dd9340"],
        ],
        slice(134, 32, "#e8cf2e", "#fbed8a"),
        "#3f8fd9",
      ),
    ),
  orange: () =>
    wrap(
      "c",
      glass(
        [
          [44, 92, "#f59a1b"],
          [44, 14, "#f8b645"],
        ],
        slice(134, 32, "#ee8a14", "#f9b44a"),
        "#e8506e",
      ),
    ),
  mango: () =>
    wrap(
      "c",
      glass(
        [
          [44, 92, "#f7b500"],
          [44, 12, "#fbd24a"],
        ],
        `<path d='M126 32 q14 -14 26 0 q-12 10 -26 0z' fill='#5fa84a'/>`,
        "#2fa38a",
      ),
    ),
  choco: () =>
    wrap(
      "c",
      glass(
        [
          [44, 92, "#4a2616"],
          [44, 12, "#6b3a22"],
        ],
        `<ellipse cx='100' cy='30' rx='31' ry='12' fill='#fff'/><ellipse cx='100' cy='24' rx='20' ry='8' fill='#fdfaf4'/><path d='M80 30 q20 -14 40 0' fill='none' stroke='#4a2616' stroke-width='3'/>`,
        "#e8506e",
      ),
    ),
  icecream: () =>
    wrap(
      "p",
      sh(100, 126, 58, 10) +
        `<path d='M52 84 h96 q0 38 -48 40 q-48 -2 -48 -40z' fill='url(#gb)' opacity='.92'/><ellipse cx='100' cy='84' rx='48' ry='9' fill='#e9eef7'/>` +
        [
          [78, 66],
          [122, 66],
          [100, 50],
        ]
          .map(
            ([x, y]) => `<circle cx='${x}' cy='${y}' r='24' fill='url(#sc)'/>`,
          )
          .join("") +
        `<path d='M62 70 q10 14 20 4 t18 8 t18 -8 t20 -4' fill='none' stroke='#4a2616' stroke-width='5' stroke-linecap='round'/><circle cx='100' cy='30' r='7' fill='#d4162c'/><path d='M100 24 q4 -12 12 -14' stroke='#4d7a2a' stroke-width='2' fill='none'/><rect x='128' y='34' width='10' height='46' rx='3' fill='#e6c27a' transform='rotate(20 133 57)'/>`,
      lg("gb", "#ffffff", "#bcd2ea") + rg("sc", "#fffbea", "#efd9a0"),
    ),
  pudding: () =>
    wrap(
      "p",
      plate() +
        `<path d='M62 98 q-4 -36 38 -36 q42 0 38 36 q-38 14 -76 0z' fill='url(#pd)'/><path d='M62 82 q38 -26 76 0 q3 8 -3 14 q-4 -6 -8 2 q-5 9 -10 -1 q-6 8 -12 0 q-8 9 -14 0 q-6 7 -12 -1 q-6 5 -10 -2 q-8 2 -7 -12z' fill='url(#cr)'/><ellipse cx='88' cy='74' rx='12' ry='4' fill='#fff' opacity='.35' transform='rotate(-18 88 74)'/>`,
      rg("pd", "#fbe29a", "#e0b24a") + rg("cr", "#c5701f", "#7a3a0e"),
    ),
  cake: () =>
    wrap(
      "p",
      plate() +
        `<rect x='54' y='62' width='92' height='52' rx='8' fill='#4b2416'/><rect x='54' y='84' width='92' height='7' fill='#f4e0bf'/><rect x='54' y='62' width='92' height='14' rx='7' fill='#2b130a'/><path d='M54 70 q10 12 20 0 t20 6 t20 -6 t18 4 t14 -4' fill='#2b130a'/><rect x='54' y='100' width='92' height='7' fill='#f4e0bf'/><circle cx='100' cy='56' r='9' fill='url(#st)'/><path d='M96 48 q4 -5 8 0' stroke='#3f7d2a' stroke-width='2.5' fill='none'/><ellipse cx='70' cy='68' rx='14' ry='2.5' fill='#fff' opacity='.25'/>`,
      rg("st", "#f0556a", "#b5162f"),
    ),
  escampur: () =>
    wrap(
      "c",
      glass(
        [
          [52, 22, "#f6fbff"],
          [74, 18, "#e94b72"],
          [92, 18, "#79c06a"],
          [110, 26, "#f5be4a"],
        ],
        `<ellipse cx='100' cy='34' rx='36' ry='16' fill='#fff'/><path d='M70 36 q30 -26 60 0z' fill='#eef6ff'/><path d='M82 28 q18 -8 36 0' fill='none' stroke='#e8365d' stroke-width='4' stroke-linecap='round'/>`,
        "#e8506e",
      ),
    ),
};
const MATCH = [
  [/nasi goreng/i, "rice"],
  [/mie/i, "noodle"],
  [/geprek|ayam goreng/i, "chicken"],
  [/soto/i, "soup"],
  [/sate/i, "skewer"],
  [/rendang/i, "rendang"],
  [/gado/i, "salad"],
  [/spaghetti|pasta/i, "pasta"],
  [/burger/i, "burger"],
  [/pangsit/i, "dumpling"],
  [/tahu/i, "tofu"],
  [/singkong/i, "cassava"],
  [/pisang/i, "banana"],
  [/kentang|fries/i, "fries"],
  [/roti/i, "toast"],
  [/americano/i, "americano"],
  [/cappuccino|latte/i, "capp"],
  [/kopi/i, "icedcoffee"],
  [/teh hangat/i, "teahot"],
  [/teh/i, "icedtea"],
  [/jeruk/i, "orange"],
  [/mangga/i, "mango"],
  [/es krim|ice cream/i, "icecream"],
  [/puding/i, "pudding"],
  [/kue|cake/i, "cake"],
  [/es campur/i, "escampur"],
  [/cokelat|coklat/i, "choco"],
];
Object.assign(ART, {
  bakso: () =>
    wrap(
      "w",
      bowl(
        `<ellipse cx='100' cy='78' rx='58' ry='16' fill='#e8b45a'/>` +
          [0, 6, 12]
            .map(
              (i) =>
                `<path d='M${54 + i} ${74 + i / 3} q10 -8 20 0 t20 0 t20 0 t20 0' fill='none' stroke='#f3e3a8' stroke-width='3' stroke-linecap='round'/>`,
            )
            .join("") +
          [
            [76, 78],
            [98, 84],
            [122, 78],
            [88, 70],
            [110, 70],
          ]
            .map(
              ([x, y]) =>
                `<circle cx='${x}' cy='${y}' r='10' fill='url(#mb)'/><circle cx='${x - 3}' cy='${y - 3}' r='3' fill='#fff' opacity='.3'/>`,
            )
            .join("") +
          scatter(
            26,
            100,
            78,
            50,
            12,
            1.8,
            ["#3f8f3a", "#79bd4d", "#c98a3a"],
            12,
          ),
      ),
      BW + rg("mb", "#c2a58a", "#7a5f4a"),
    ),
  alpukat: () =>
    wrap(
      "c",
      glass(
        [
          [44, 92, "#b5d065"],
          [44, 16, "#d6e68f"],
          [100, 40, "#6a4326"],
        ],
        `<ellipse cx='136' cy='34' rx='13' ry='16' fill='#4e7a2a'/><ellipse cx='136' cy='34' rx='10' ry='13' fill='#cfe38a'/><circle cx='136' cy='38' r='6' fill='#7a4a22'/>`,
        "#e8506e",
      ),
    ),
  donut: () =>
    wrap(
      "p",
      plate() +
        [
          [70, 86],
          [130, 86],
          [100, 100],
        ]
          .map(
            ([x, y], i) =>
              `<g transform='translate(${x} ${y})'><ellipse rx='27' ry='19' fill='#d9a15a'/><ellipse cy='-2' rx='25' ry='16' fill='${i === 1 ? "#f2a0b8" : "url(#ch)"}'/><ellipse cy='-1' rx='8' ry='5' fill='#f6f3ee'/>${scatter(16, 0, -2, 20, 12, 1.3, ["#fff", "#ffd23f", "#5fc2f0", "#ff6b81"], x + i)}</g>`,
          )
          .join(""),
      rg("ch", "#7a4228", "#3b1d10"),
    ),
});
MATCH.unshift(
  [/bakso/i, "bakso"],
  [/alpukat|avokad/i, "alpukat"],
  [/donat|donut/i, "donut"],
);
const generic = (emo) =>
  wrap(
    "c",
    plate() +
      `<text x='100' y='92' font-size='54' text-anchor='middle' dominant-baseline='central'>${esc(emo)}</text>`,
  );
const artCache = {};
function artSrc(m) {
  const hit = MATCH.find(([r]) => r.test(m.name || "")),
    key = hit ? hit[1] : "x" + (m.emo || "");
  if (!artCache[key])
    artCache[key] =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(hit ? ART[hit[1]]() : generic(m.emo || "🍽️"));
  return artCache[key];
}
const imgFor = (m) => m.photo || artSrc(m);
function prevPic() {
  $("#fPrev").src =
    ui.photo || artSrc({ name: $("#fName").value, emo: $("#fEmo").value });
  $("#unpicBtn").disabled = !ui.photo;
}
