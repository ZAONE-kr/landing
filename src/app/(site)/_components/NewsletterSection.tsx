import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-bg-navy px-lg py-6xl lg:p-7xl">
      <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-3xl lg:gap-6xl">
        <div className="flex flex-col items-center gap-xl text-center">
          <h2 className="text-title-m-b text-text-inverse lg:text-heading-m-b">
            우리가 더 오래
            <br className="lg:hidden" /> 들여다보는 것들을
            <br />
            함께 받아보세요
          </h2>
          <p className="text-body-xs-m text-text-quaternary lg:text-body-m-m">
            물질과 교육, 지속가능성, 기업과 함께 만든 변화에 대한
            <br className="lg:hidden" /> 새로운 기록을 보내드립니다.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
