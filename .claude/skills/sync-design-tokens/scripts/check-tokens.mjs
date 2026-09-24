// Figma get_variable_defs 결과(JSON)와 globals.css의 디자인 토큰을 비교한다.
// 사용법: node check-tokens.mjs <figma-vars.json> [globals.css]
// 종료 코드: 0 = 일치, 1 = 차이 있음, 2 = 입력 오류
import { existsSync, readFileSync } from "node:fs";

const [figmaPath, cssPath = "src/app/globals.css"] = process.argv.slice(2);
if (!figmaPath) {
  console.error("사용법: node check-tokens.mjs <figma-vars.json> [globals.css]");
  process.exit(2);
}

const figma = JSON.parse(readFileSync(figmaPath, "utf8"));
const css = readFileSync(cssPath, "utf8");

// 사용자가 "코드에만 남긴다"고 결정한 토큰. 한 줄에 하나, # 뒤는 주석.
const keepPath = new URL("../keep-tokens.txt", import.meta.url);
const keep = new Set(
  existsSync(keepPath)
    ? readFileSync(keepPath, "utf8")
        .split("\n")
        .map((line) => line.replace(/#.*/, "").trim())
        .filter(Boolean)
    : [],
);

// Figma가 주는 float32 오차(1.2999999523162842)를 걷어낸다.
const round = (n) => +n.toFixed(2);
const near = (a, b) => Math.abs(a - b) < 1e-4;

// ---- Figma 쪽 ----
const figmaColors = {};
const figmaTexts = {};
const figmaOther = [];
for (const [key, value] of Object.entries(figma)) {
  const color = key.match(/^var\((--(?:primitive|color)-[a-z0-9-]+)\)$/);
  const font = value.match(/^Font\((.*)\)$/);
  if (color) {
    figmaColors[color[1]] = value.toLowerCase();
  } else if (font) {
    const f = Object.fromEntries(
      [...font[1].matchAll(/(\w+): ("[^"]*"|[^,]+)/g)].map(([, k, v]) => [k, v.replace(/"/g, "")]),
    );
    figmaTexts[key] = {
      family: f.family,
      style: f.style,
      size: +f.size,
      weight: +f.weight,
      lineHeight: round(+f.lineHeight),
      letterSpacing: round(+f.letterSpacing),
    };
  } else {
    figmaOther.push(`${key}: ${value}`);
  }
}

// ---- 코드 쪽 ----
const defs = {};
for (const [, name, value] of css.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g))
  defs[name] = value.trim();
const resolve = (v, seen = new Set()) => {
  const m = v?.match(/^var\((--[a-z0-9-]+)\)$/);
  if (!m || seen.has(m[1])) return v;
  seen.add(m[1]);
  return resolve(defs[m[1]], seen);
};
const codeColors = Object.keys(defs).filter(
  (k) => /^--(primitive|color)-/.test(k) && k !== "--color-*",
);
const codeTexts = Object.keys(defs).filter(
  (k) => /^--text-[a-z0-9-]+$/.test(k) && !k.includes("--", 2),
);

// ---- 비교 ----
const issues = { mismatch: [], missing: [], extra: [], kept: [], warn: [] };
const addExtra = (name) => (keep.has(name) ? issues.kept : issues.extra).push(name);
const hexToPrimitive = {};
for (const [name, hex] of Object.entries(figmaColors)) {
  if (name.startsWith("--primitive-")) (hexToPrimitive[hex] ??= []).push(name);
}

for (const [name, hex] of Object.entries(figmaColors)) {
  const isSemantic = name.startsWith("--color-");
  const alias = hexToPrimitive[hex];
  const suggestion = isSemantic
    ? alias?.length === 1
      ? `var(${alias[0]})`
      : `(같은 값의 primitive ${alias ? alias.join(", ") + " 중 Figma 가이드로 확인" : "없음 — Figma에서 alias 확인"})`
    : hex;
  if (!(name in defs)) {
    issues.missing.push(`${name}: ${suggestion};`);
    continue;
  }
  const got = resolve(defs[name])?.toLowerCase();
  if (got !== hex) {
    const hint =
      isSemantic && defs[name] === suggestion
        ? `참조는 맞음 — ${alias[0]} 값을 고치면 해결`
        : `제안: ${suggestion}`;
    issues.mismatch.push(`${name}: 코드 ${got} → Figma ${hex} (${hint})`);
  }
  if (isSemantic && !defs[name].startsWith("var(--primitive-")) {
    issues.warn.push(`${name}이 primitive를 참조하지 않고 값을 직접 쓴다: ${defs[name]}`);
  }
}
for (const name of codeColors) if (!(name in figmaColors)) addExtra(name);

for (const [styleName, t] of Object.entries(figmaTexts)) {
  const k = `--text-${styleName.toLowerCase()}`;
  const want = {
    size: `${t.size / 16}rem`,
    "line-height": t.lineHeight,
    "letter-spacing": `${t.letterSpacing}px`,
    "font-weight": t.weight,
  };
  if (!(k in defs)) {
    issues.missing.push(
      `${k}: ${want.size}; ${k}--line-height: ${want["line-height"]}; ` +
        `${k}--letter-spacing: ${want["letter-spacing"]}; ${k}--font-weight: ${want["font-weight"]};`,
    );
  } else {
    const got = {
      size: parseFloat(defs[k]) * (defs[k].endsWith("rem") ? 16 : 1),
      "line-height": parseFloat(defs[`${k}--line-height`]),
      "letter-spacing": parseFloat(defs[`${k}--letter-spacing`]),
      "font-weight": parseFloat(defs[`${k}--font-weight`]),
    };
    const expected = {
      size: t.size,
      "line-height": t.lineHeight,
      "letter-spacing": t.letterSpacing,
      "font-weight": t.weight,
    };
    for (const prop of Object.keys(expected)) {
      if (!near(got[prop], expected[prop])) {
        const name = prop === "size" ? k : `${k}--${prop}`;
        issues.mismatch.push(`${name}: 코드 ${defs[name] ?? "(없음)"} → Figma ${want[prop]}`);
      }
    }
  }
  if (t.family === "Axiforma" && t.weight !== 300) {
    issues.warn.push(
      `${styleName}: Axiforma ${t.style}(${t.weight})는 레포에 파일이 없다 — 폰트 파일 추가 필요`,
    );
  } else if (!["Pretendard", "Axiforma"].includes(t.family)) {
    issues.warn.push(`${styleName}: 새 폰트 ${t.family} — 폰트 설정 추가 필요`);
  }
}
for (const k of codeTexts) {
  if (!Object.keys(figmaTexts).some((s) => `--text-${s.toLowerCase()}` === k)) addExtra(k);
}

// ---- 보고 ----
const section = (title, list) => {
  if (!list.length) return;
  console.log(`\n## ${title} (${list.length})`);
  for (const line of list) console.log(`- ${line}`);
};
console.log(
  `Figma: 색상 ${Object.keys(figmaColors).length}개, 텍스트 스타일 ${Object.keys(figmaTexts).length}개` +
    ` / 코드: 색상 ${codeColors.length}개, 텍스트 스타일 ${codeTexts.length}개`,
);
section("값이 다름 → Figma 값으로 고친다", issues.mismatch);
section("코드에 없음 → 추가한다", issues.missing);
section("Figma 결과에 없음 → 지우기 전에 사용자에게 확인한다", issues.extra);
section("코드 전용으로 남김 (keep-tokens.txt)", issues.kept);
section("확인 필요", issues.warn);
section("비교하지 않은 Figma 값", figmaOther);

const dirty = issues.mismatch.length + issues.missing.length + issues.extra.length > 0;
console.log(dirty ? "\n결과: 차이 있음" : "\n결과: 일치");
process.exit(dirty ? 1 : 0);
