import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  external?: boolean;
};

export function ButtonLink({ href, variant = "primary", size = "md", external, className, children, ...rest }: Props) {
  const ext = external ?? /^https?:/.test(href);
  return (
    <a
      href={href}
      className={cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", size === "sm" && "btn-sm", className)}
      {...(ext ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

/** ↗ for links that leave the page. */
export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden className={cn("shrink-0", className)}>
      <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
