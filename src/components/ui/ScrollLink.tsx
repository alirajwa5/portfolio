"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useScrollTo } from "@/components/layout/SmoothScroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  offset?: number;
};

/** In-page anchor that scrolls with Lenis and keeps the hash in the URL. */
export function ScrollLink({ href, offset = -72, onClick, children, ...rest }: Props) {
  const scrollTo = useScrollTo();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !href.startsWith("#")) return;
    e.preventDefault();
    scrollTo(href, offset);
    window.history.replaceState(null, "", href);
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
