import type { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

export function Panel({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur",
        className,
      )}
    >
      {children}
    </section>
  );
}
