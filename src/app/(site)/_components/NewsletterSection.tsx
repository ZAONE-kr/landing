import { loadSection } from "@/sanity/lib/sections";
import { HOME_NEWSLETTER } from "@/sanity/sections/home";

import { NewsletterForm } from "./NewsletterForm";

// 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 제목은 시안의 줄을 기본값에 줄바꿈으로 담아 두었다(Enter로 고칠 수 있다).
export async function NewsletterSection() {
  const { title, body, emailLabel, placeholder, button } = await loadSection(HOME_NEWSLETTER);

  return (
    <section className="bg-bg-navy px-lg py-6xl lg:p-7xl">
      <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-3xl lg:gap-6xl">
        <div className="flex flex-col items-center gap-xl text-center">
          <h2 className="text-title-m-b text-balance break-keep whitespace-pre-line text-text-inverse lg:text-heading-m-b">
            {title}
          </h2>
          <p className="max-w-[20rem] text-body-xs-m break-keep text-text-quaternary lg:max-w-[52rem] lg:text-body-m-m">
            {body}
          </p>
        </div>
        <NewsletterForm label={emailLabel} placeholder={placeholder} button={button} />
      </div>
    </section>
  );
}
