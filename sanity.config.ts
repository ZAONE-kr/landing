"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "@/sanity/env";

export default defineConfig({
  title: "자원(ZAONE)",
  basePath: "/admin",
  projectId,
  dataset,
  plugins: [structureTool()],
  // 게시판 구조가 정해지면 문서 종류를 채운다.
  schema: { types: [] },
});
