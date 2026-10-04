import Image from "next/image";

import closingImage from "@/assets/impact/closing-mattress-factory.jpg";
import { Button } from "@/components/ui/Button";

import { ExpandOnScroll } from "./ExpandOnScroll";

/*
 * 처음에는 둥근 사진 카드만 있고(1024 1008:11088, 375 1008:11073), 스크롤하면 카드가 화면을 가득 채우고
 * 문구와 버튼이 아래에서 올라온다(다 채운 모습은 1024 965:8906, 375 1008:11066). 파타고니아처럼 섹션이 화면
 * 높이만큼이라, 시안의 띠(542·310px)보다 카드와 사진이 크다. 진행도는 ExpandOnScroll이 맡는다.
 * - 사진 창: 섹션에서 좌우·아래를 --ix·--ib만큼 들인 카드(위는 섹션에 붙는다)가 --e를 따라 화면 전체로 넓어진다.
 *   창은 섹션 아래로 1px 더 내려 둔다. 다 펼쳤을 때 창 가장자리의 흐린 1px이 푸터 위에 놓여, 사진과 푸터 사이에
 *   흰 선이 비치지 않는다. 카드일 때 아래 여백은 그대로 --ib다.
 * - 사진: 창 폭에 맞춘 틀에서 화면 높이를 덮도록 잘라, 창이 넓어지는 동안 사진도 함께 커진다.
 *   화면이 3:2보다 좁으면(세로 휴대폰 등) 높이에 맞춰 양옆이 잘린다.
 * - 문구와 버튼: 한 덩어리로, 가운데가 화면 아래 끝에서 화면 가운데까지 올라오며 나타난다(--q).
 *   절반도 안 올라왔을 때는 버튼을 누를 수 없다.
 * 창은 overflow-clip으로 자른다. hidden이면 아래로 밀려 있는 버튼에 키보드로 들어갈 때 브라우저가 창 안을
 * 스크롤해 버려 검정 막과 문구가 사진에서 어긋난 채 남는다.
 * 검정 50%는 두 상태 모두 같고, Figma에서 변수 없이 쓴 값이다.
 */
// TODO: 버튼이 갈 곳을 아직 받지 못해 INSIGHTS로 보낸다. 주소를 받으면 바꾼다.
export function ChangeRecordSection() {
  return (
    <ExpandOnScroll className="h-screen">
      <div className="absolute inset-x-0 top-0 -bottom-px overflow-clip [--ib:var(--spacing-xl)] [--ix:var(--spacing-xl)] [--r:var(--radius-sm)] [clip-path:inset(0_calc(var(--ix)*(1-var(--e)))_calc((var(--ib)+1px)*(1-var(--e)))_round_calc(var(--r)*(1-var(--e))))] lg:[--ib:var(--spacing-3xl)] lg:[--ix:var(--spacing-3xl)] lg:[--r:var(--radius-lg)]">
        <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2*var(--ix)*(1-var(--e)))] -translate-x-1/2">
          <Image
            src={closingImage}
            alt=""
            fill
            placeholder="blur"
            sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[rgb(0_0_0/0.5)]" />

        <div className="absolute inset-0 flex translate-y-[calc((1-var(--q))*50%)] flex-col items-center justify-center gap-xl px-lg py-4xl text-center opacity-[calc(1-(1-var(--q))*(1-var(--q)))] group-data-[revealed=false]/expand:pointer-events-none lg:gap-5xl lg:p-7xl">
          <div className="flex max-w-[51.25rem] flex-col gap-s text-text-inverse lg:gap-xl">
            <h2 className="text-title-m-b lg:text-heading-s-b">
              변화는 한 번의 결과로
              <br className="lg:hidden" /> 끝나지 않습니다.
            </h2>
            <p className="text-body-xs-m text-pretty lg:text-body-sm-m">
              ZAONE은 현장에서 확인한 변화와 데이터를 계속 축적하고,
              <br /> 그 과정에서 발견한 질문과 인사이트를
              <br className="lg:hidden" /> 기록합니다.
            </p>
          </div>
          <Button
            href="/insights"
            variant="inverse"
            className="px-xl py-sm text-body-xs-b lg:px-6xl lg:py-xl lg:text-body-sm-b"
          >
            데이터와 변화의 기록 보기
          </Button>
        </div>
      </div>
    </ExpandOnScroll>
  );
}
