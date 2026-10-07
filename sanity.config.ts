"use client";

import { defineConfig, type SanityDefinedAction } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "@/sanity/env";
import { schemaTypes, SINGLETON_TYPES } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

// 문서가 하나뿐인 종류에 남길 동작: 게시, 초안 버리기, 예전 버전으로 되돌리기, 릴리스에 넣은 버전 버리기.
// 삭제·복제·게시 취소·예약 게시·Canvas 연결·작업(Task) 만들기는 뺀다.
const SINGLETON_ACTIONS = new Set<SanityDefinedAction>([
  "publish",
  "discardChanges",
  "restore",
  "discardVersion",
]);

export default defineConfig({
  title: "자원(ZAONE)",
  basePath: "/admin",
  projectId,
  dataset,
  plugins: [structureTool({ title: "콘텐츠", structure })],
  schema: { types: schemaTypes },
  document: {
    // "새 문서" 메뉴에서만 뺀다. schema.templates에서 빼면 처음 열 때 태그(initialValue)가 채워지지 않는다.
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETON_TYPES.has(item.templateId)),
    actions: (prev, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? prev.filter(({ action }) => action !== undefined && SINGLETON_ACTIONS.has(action))
        : prev,
  },
});
