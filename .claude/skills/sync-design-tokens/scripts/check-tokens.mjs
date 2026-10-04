// Figma 파일의 변수·텍스트 스타일 전체(JSON)와 globals.css의 디자인 토큰을 비교한다.
// 입력은 dump-figma.js를 use_figma로 실행한 결과다. get_variable_defs 결과는 받지 않는다.
// 사용법: node check-tokens.mjs <figma-tokens.json> [globals.css]
// 종료 코드: 0 = 일치, 1 = 차이 있음, 2 = 입력 오류
import { existsSync, readFileSync } from "node:fs";

const [figmaPath, cssPath = "src/app/globals.css"] = process.argv.slice(2);
if (!figmaPath) {
  console.error("사용법: node check-tokens.mjs <figma-tokens.json> [globals.css]");
  process.exit(2);
}

const figma = JSON.parse(readFileSync(figmaPath, "utf8"));
const css = readFileSync(cssPath, "utf8");

if (!Array.isArray(figma.collections) || !Array.isArray(figma.textStyles)) {
  console.error("dump-figma.js 결과가 아니다. get_variable_defs 결과로는 비교하지 않는다.");
  process.exit(2);
}
if (!figma.collections.some((c) => c.variables.length) && !figma.textStyles.length) {
  console.error("Figma 결과가 비어 있다. use_figma의 fileKey가 디자인 시스템 파일인지 확인한다.");
  process.exit(2);
}

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
const round = (n, digits = 2) => +n.toFixed(digits);
const near = (a, b) => Math.abs(a - b) < 1e-4;
const slug = (name) => name.toLowerCase().replace(/[/_\s]+/g, "-");
// 0은 단위 없이, 원형용 큰 값(radius-full)은 px, 나머지는 rem.
const length = (px) => (px === 0 ? "0" : px >= 1000 ? `${px}px` : `${px / 16}rem`);
const toPx = (v) => (v?.endsWith("rem") ? parseFloat(v) * 16 : parseFloat(v));

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
const codeTokens = (prefix) =>
  Object.keys(defs).filter((k) => k.startsWith(prefix) && !k.includes("--", 2));

const issues = { mismatch: [], missing: [], extra: [], kept: [], warn: [], figmaTodo: [] };
const other = [];
const addExtra = (name) => (keep.has(name) ? issues.kept : issues.extra).push(name);

// ---- Figma 변수 ----
// 코드 이름은 Dev Mode code syntax를 따르고, 없으면 Figma 이름에서 만든다.
const byId = {};
for (const c of figma.collections)
  for (const v of c.variables) byId[v.id] = { ...v, collection: c };
const codeName = (v) => {
  const syntax = v.codeSyntax?.match(/--[A-Za-z0-9_-]+/)?.[0];
  if (syntax) return syntax;
  if (v.type === "COLOR")
    return /primitive/i.test(v.collection.name)
      ? `--primitive-${slug(v.name)}`
      : `--color-${slug(v.name)}`;
  return `--${slug(v.name)}`;
};
const hexOf = (v, seen = new Set()) => {
  if (typeof v.value === "string") return v.value.toLowerCase();
  const target = byId[v.value?.alias];
  if (!target || seen.has(target.id)) return null;
  seen.add(target.id);
  return hexOf(target, seen);
};

const figmaNames = new Set();
const noSyntax = {}; // 컬렉션별 code syntax 없는 변수 수. 이름은 만들 수 있으니 개수만 알린다.
for (const c of figma.collections) {
  if (c.modes.length > 1)
    issues.warn.push(`${c.name}: 모드가 ${c.modes.length}개다. 기본 모드만 비교했다`);
  for (const v of c.variables) {
    if (v.type !== "COLOR" && v.type !== "FLOAT") {
      other.push(`${c.name} / ${v.name}: ${v.value}`);
      continue;
    }
    const name = codeName(byId[v.id]);
    const label = `${c.name} / ${v.name}`;
    if (!v.codeSyntax) noSyntax[c.name] = (noSyntax[c.name] ?? 0) + 1;
    if (/_/.test(v.name)) issues.figmaTodo.push(`${label}: 이름에 밑줄(_)이 있다 → 코드는 ${name}`);

    if (v.type === "FLOAT") {
      if (!/^--(spacing|radius)-/.test(name)) {
        issues.warn.push(
          `${label} (${name} = ${v.value}): spacing·radius가 아닌 숫자 변수 — 옮길 규칙이 없다`,
        );
        continue;
      }
      figmaNames.add(name);
      if (!(name in defs)) issues.missing.push(`${name}: ${length(v.value)};`);
      else if (!near(toPx(defs[name]), v.value))
        issues.mismatch.push(`${name}: 코드 ${defs[name]} → Figma ${length(v.value)}`);
      continue;
    }

    figmaNames.add(name);
    const target = byId[v.value?.alias];
    const hex = hexOf(v);
    if (v.value?.alias && !target) {
      issues.warn.push(`${label}: 이 파일에 없는 변수를 참조한다 (${v.value.alias})`);
      continue;
    }
    const want = target ? `var(${codeName(target)})` : hex;
    if (name.startsWith("--color-") && !target)
      issues.warn.push(`${label}: semantic인데 primitive를 참조하지 않고 값을 직접 쓴다 (${hex})`);
    if (!(name in defs)) issues.missing.push(`${name}: ${want};`);
    else if (target ? defs[name] !== want : resolve(defs[name])?.toLowerCase() !== hex)
      issues.mismatch.push(`${name}: 코드 ${defs[name]} → Figma ${want} (${hex})`);
  }
}
for (const prefix of ["--primitive-", "--color-", "--spacing-", "--radius-"])
  for (const name of codeTokens(prefix)) if (!figmaNames.has(name)) addExtra(name);

// ---- 텍스트 스타일 ----
const WEIGHTS = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Book: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};
// layout.tsx의 Axiforma localFont 호출(굵기마다 하나, 또는 src 배열 항목)에 올린 굵기.
// Pretendard는 가변 폰트라 보지 않는다.
const layoutPath = new URL("../../../../src/app/layout.tsx", import.meta.url);
const axiformaWeights = new Set(
  existsSync(layoutPath)
    ? [
        ...readFileSync(layoutPath, "utf8").matchAll(
          /(?:path|src):\s*"[^"]*Axiforma-[^"]*",\s*weight:\s*"(\d+)"/g,
        ),
      ].map((m) => Number(m[1]))
    : [],
);
const figmaTexts = new Set();
for (const t of figma.textStyles) {
  // Figma 폴더(Heading/Heading-L-EB의 Heading/)는 뺀다. 스타일 이름에 그룹이 이미 들어 있다.
  const k = `--text-${slug(t.name.split("/").pop())}`;
  if (figmaTexts.has(k))
    issues.warn.push(`${t.name}: 폴더를 빼면 다른 스타일과 이름(${k})이 겹친다`);
  figmaTexts.add(k);
  if (/_/.test(t.name))
    issues.figmaTodo.push(`텍스트 스타일 ${t.name}: 이름에 밑줄(_)이 있다 → 코드는 ${k}`);

  const weight = WEIGHTS[t.style];
  if (!weight) issues.warn.push(`${t.name}: 굵기 이름 ${t.style}을 숫자로 바꿀 수 없다`);
  let lineHeight = null;
  if (t.lineHeight.unit === "PERCENT") lineHeight = round(t.lineHeight.value / 100);
  else if (t.lineHeight.unit === "PIXELS") {
    lineHeight = round(t.lineHeight.value / t.size);
    issues.warn.push(
      `${t.name}: 행간이 px(${t.lineHeight.value})다. ${lineHeight}로 바꿨으니 확인한다`,
    );
  } else issues.warn.push(`${t.name}: 행간이 AUTO다 — 행간은 비교하지 않았다`);
  // Figma 자간이 %면 글자 크기에 비례하므로 em으로 옮긴다 (-2% → -0.02em).
  const ls =
    t.letterSpacing.unit === "PERCENT"
      ? { value: round(t.letterSpacing.value / 100, 4), unit: "em" }
      : { value: round(t.letterSpacing.value), unit: "px" };

  const want = {
    [k]: `${t.size / 16}rem`,
    [`${k}--line-height`]: lineHeight,
    [`${k}--letter-spacing`]: `${ls.value}${ls.unit}`,
    [`${k}--font-weight`]: weight,
  };
  if (!(k in defs)) {
    issues.missing.push(
      Object.entries(want)
        .filter(([, v]) => v != null)
        .map(([name, v]) => `${name}: ${v};`)
        .join(" "),
    );
  } else {
    const same = {
      [k]: near(toPx(defs[k]), t.size),
      [`${k}--line-height`]:
        lineHeight == null || near(parseFloat(defs[`${k}--line-height`]), lineHeight),
      [`${k}--letter-spacing`]:
        near(parseFloat(defs[`${k}--letter-spacing`]), ls.value) &&
        defs[`${k}--letter-spacing`]?.endsWith(ls.unit),
      [`${k}--font-weight`]: weight == null || near(parseFloat(defs[`${k}--font-weight`]), weight),
    };
    for (const [name, ok] of Object.entries(same))
      if (!ok)
        issues.mismatch.push(`${name}: 코드 ${defs[name] ?? "(없음)"} → Figma ${want[name]}`);
  }

  if (t.family === "Axiforma" && !axiformaWeights.has(weight)) {
    issues.warn.push(
      `${t.name}: Axiforma ${t.style}(${weight})는 레포에 파일이 없다 — 폰트 파일 추가 필요`,
    );
  } else if (!["Pretendard", "Axiforma"].includes(t.family)) {
    issues.warn.push(`${t.name}: 새 폰트 ${t.family} — 폰트 설정 추가 필요`);
  }
}
for (const k of codeTokens("--text-")) if (!figmaTexts.has(k)) addExtra(k);

// ---- 보고 ----
const noSyntaxTotal = Object.values(noSyntax).reduce((a, b) => a + b, 0);
if (noSyntaxTotal) {
  const detail = Object.entries(noSyntax)
    .map(([name, n]) => `${name} ${n}`)
    .join(", ");
  issues.figmaTodo.unshift(
    `code syntax 없음 ${noSyntaxTotal}개 (${detail}) → 코드는 Figma 이름에서 만든 이름을 쓴다`,
  );
}
const section = (title, list) => {
  if (!list.length) return;
  console.log(`\n## ${title} (${list.length})`);
  for (const line of list) console.log(`- ${line}`);
};
const count = (prefix, set) => [...set].filter((n) => n.startsWith(prefix)).length;
const colors = count("--primitive-", figmaNames) + count("--color-", figmaNames);
console.log(
  `Figma: 색상 ${colors}개, spacing ${count("--spacing-", figmaNames)}개, radius ${count("--radius-", figmaNames)}개, 텍스트 스타일 ${figmaTexts.size}개` +
    ` / 코드: 색상 ${codeTokens("--primitive-").length + codeTokens("--color-").length}개, spacing ${codeTokens("--spacing-").length}개,` +
    ` radius ${codeTokens("--radius-").length}개, 텍스트 스타일 ${codeTokens("--text-").length}개`,
);
section("값이 다름 → Figma 값으로 고친다", issues.mismatch);
section("코드에 없음 → 추가한다 (Figma 변수 패널 순서)", issues.missing);
section("Figma에 없음 → 지우기 전에 사용자에게 확인한다", issues.extra);
section("코드 전용으로 남김 (keep-tokens.txt)", issues.kept);
section("확인 필요", issues.warn);
section(
  "Figma 쪽 정리 필요 → 보고에 적어 디자이너에게 전달한다 (결과에는 영향 없음)",
  issues.figmaTodo,
);
section("비교하지 않은 Figma 값", other);

const dirty = issues.mismatch.length + issues.missing.length + issues.extra.length > 0;
console.log(dirty ? "\n결과: 차이 있음" : "\n결과: 일치");
process.exit(dirty ? 1 : 0);
