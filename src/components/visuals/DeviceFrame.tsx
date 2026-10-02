import Image from "next/image";
import type { ReactNode } from "react";
import type { DeviceKind } from "@/content/apps";
import { cn } from "@/lib/utils";

const SHAPE: Record<DeviceKind, { outer: string; inner: string; width: string }> = {
  phone: { outer: "aspect-[9/18] rounded-[2.6rem] p-2.5", inner: "rounded-[2.05rem]", width: "w-[290px]" },
  tablet: { outer: "aspect-[16/10] rounded-[1.6rem] p-3", inner: "rounded-[1rem]", width: "w-[560px] max-w-full" },
  "tablet-portrait": { outer: "aspect-[10/14] rounded-[1.6rem] p-3", inner: "rounded-[1rem]", width: "w-[360px] max-w-full" },
};

/** Device bezel, dark in both themes. Width is a class so callers can shrink it (mobile cards). */
export function DeviceFrame({
  kind = "phone",
  children,
  className,
  widthClass,
}: {
  kind?: DeviceKind;
  children: ReactNode;
  className?: string;
  widthClass?: string;
}) {
  const s = SHAPE[kind];
  return (
    <div
      className={cn(
        "relative border border-bezel-line bg-gradient-to-b from-bezel to-bezel-2",
        "shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] light:shadow-[0_50px_100px_-40px_rgba(60,40,10,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]",
        s.outer,
        widthClass ?? s.width,
        className,
      )}
    >
      {kind === "phone" && (
        <>
          <span className="absolute -left-[3px] top-24 h-14 w-[3px] rounded-l bg-bezel-line" />
          <span className="absolute -right-[3px] top-20 h-9 w-[3px] rounded-r bg-bezel-line" />
          <span className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-bezel-line" />
        </>
      )}
      <div className={cn("relative h-full w-full overflow-hidden bg-stage", s.inner)}>{children}</div>
    </div>
  );
}

export function DeviceShot({
  src,
  alt,
  kind = "phone",
  sizes,
  priority = false,
  widthClass,
  className,
}: {
  src: string;
  alt: string;
  kind?: DeviceKind;
  sizes?: string;
  priority?: boolean;
  widthClass?: string;
  className?: string;
}) {
  return (
    <DeviceFrame kind={kind} widthClass={widthClass} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? (kind === "phone" ? "290px" : "560px")}
        priority={priority}
        draggable={false}
        className="pointer-events-none select-none object-cover object-top"
      />
    </DeviceFrame>
  );
}
