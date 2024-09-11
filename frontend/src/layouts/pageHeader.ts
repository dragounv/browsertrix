import { msg } from "@lit/localize";
import type { SlBreadcrumb } from "@shoelace-style/shoelace";
import clsx from "clsx";
import { html, nothing, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { NavigateController } from "@/controllers/navigate";
import { tw } from "@/utils/tailwind";

export type Breadcrumb = {
  href?: string;
  content?: string | TemplateResult;
};

function navigateBreadcrumb(e: MouseEvent, href: string) {
  e.preventDefault();

  const el = e.target as SlBreadcrumb;
  const evt = NavigateController.createNavigateEvent({
    url: href,
    resetScroll: true,
  });

  el.dispatchEvent(evt);
}

export function breadcrumbSeparator() {
  return html`<span
    class="font-mono font-thin text-neutral-400"
    role="separator"
    >/</span
  > `;
}

const separator = breadcrumbSeparator();
const skeleton = html`<sl-skeleton class="w-48"></sl-skeleton>`;

function breadcrumbLink({ href, content }: Breadcrumb, classNames?: string) {
  if (!content) return skeleton;

  return html`
    <a
      class=${clsx(
        tw`flex h-5 items-center gap-1 truncate whitespace-nowrap leading-5`,
        href
          ? tw`font-medium text-neutral-500 transition-colors hover:text-neutral-700`
          : tw`font-medium text-primary`,
        classNames,
      )}
      href=${ifDefined(href)}
      @click=${href
        ? (e: MouseEvent) => navigateBreadcrumb(e, href)
        : undefined}
    >
      ${content}
    </a>
  `;
}

function pageBreadcrumbs(breadcrumbs: Breadcrumb[]) {
  return html`
    <nav class="flex flex-wrap items-center gap-2 text-neutral-500">
      ${breadcrumbs.length
        ? breadcrumbs.map(
            (breadcrumb, i) => html`
              ${i !== 0 ? separator : nothing}
              ${breadcrumbLink(breadcrumb, tw`max-w-[30ch]`)}
            `,
          )
        : html`${skeleton} ${separator} ${skeleton}`}
    </nav>
  `;
}

export function pageBack({ href, content }: Breadcrumb) {
  if (!href) return;

  return breadcrumbLink({
    href,
    content: html`
      <sl-icon name="chevron-left" class="size-4 text-neutral-500"></sl-icon>
      ${content ? html` ${msg("Back to")} ${content}` : msg("Back")}
    `,
  });
}

export function pageTitle(title?: string | TemplateResult) {
  return html`
    <h1 class="min-w-0 text-xl font-semibold leading-8">
      ${title || html`<sl-skeleton class="my-.5 h-5 w-60"></sl-skeleton>`}
    </h1>
  `;
}

export function pageNav(breadcrumbs: Breadcrumb[]) {
  if (breadcrumbs.length === 1) {
    return pageBack(breadcrumbs[0]);
  }

  return pageBreadcrumbs(breadcrumbs);
}

export function pageHeader(
  title?: string | TemplateResult,
  suffix?: TemplateResult<1>,
  classNames?: string,
) {
  return html`
    <header
      class=${clsx(
        "mt-5 flex items-end flex-wrap justify-between gap-2 border-b pb-3",
        classNames,
      )}
    >
      ${pageTitle(title)}
      ${suffix
        ? html`<div class="ml-auto flex items-center gap-2">${suffix}</div>`
        : nothing}
    </header>
  `;
}