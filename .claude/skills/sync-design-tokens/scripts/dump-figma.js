// use_figma의 code로 이 파일 내용을 그대로 넘긴다. 읽기만 하고 파일을 바꾸지 않는다.
// 파일에 등록된 로컬 변수와 텍스트 스타일 전체를 check-tokens.mjs 입력 형식으로 돌려준다.
// 맨 바깥 return은 use_figma가 코드를 async 함수로 감싸기 때문에 가능하다 (lint·prettier 제외 대상).
const hex = (c) => {
  const h = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return "#" + h(c.r) + h(c.g) + h(c.b) + (c.a === undefined || c.a === 1 ? "" : h(c.a));
};
const raw = (value) => {
  if (value && value.type === "VARIABLE_ALIAS") return { alias: value.id };
  if (value && typeof value === "object" && "r" in value) return hex(value);
  return value;
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = new Map(
  (await figma.variables.getLocalVariablesAsync()).map((v) => [v.id, v]),
);

return {
  file: figma.root.name,
  // 컬렉션과 변수는 Figma 변수 패널 순서 그대로다.
  collections: collections.map((c) => ({
    name: c.name,
    modes: c.modes.map((m) => m.name),
    variables: c.variableIds
      .map((id) => variables.get(id))
      .filter(Boolean)
      .map((v) => ({
        id: v.id,
        name: v.name,
        type: v.resolvedType,
        codeSyntax: v.codeSyntax.WEB ?? null,
        value: raw(v.valuesByMode[c.defaultModeId]),
      })),
  })),
  textStyles: (await figma.getLocalTextStylesAsync()).map((s) => ({
    name: s.name,
    family: s.fontName.family,
    style: s.fontName.style,
    size: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
  })),
};
