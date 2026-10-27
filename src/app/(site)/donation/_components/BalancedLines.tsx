import { Fragment } from "react";

/*
 * 운영자가 Enter로 나눈 줄을 블록으로 하나씩 그린다. Chrome은 강제 줄바꿈(\n·br)이 섞인 문단에는 text-balance를
 * 적용하지 않아서, 줄마다 블록으로 나눠 각 블록 안에서 따로 고르게 나뉘게 한다. 부모에 text-balance를 둔다.
 * 블록 사이의 공백은 화면에는 안 보이고, 화면 낭독기가 앞뒤 줄을 붙여 읽지 않게 한다.
 */
export function BalancedLines({ text }: { text: string }) {
  return text.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="block">{line}</span>
    </Fragment>
  ));
}
