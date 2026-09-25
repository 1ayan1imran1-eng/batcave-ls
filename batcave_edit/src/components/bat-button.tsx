import type { ButtonHTMLAttributes } from "react";
import { BatEmblem } from "./bat-emblem";
import { cn } from "@/lib/utils";

type Variant = "wing" | "compact" | "inline";

interface BatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  variant?: Variant;
  hideLabel?: boolean;
}

export function BatButton({
  label,
  active,
  variant = "wing",
  hideLabel,
  className,
  ...rest
}: BatButtonProps) {
  if (variant === "inline") {
    return (
      <button
        type="button"
        aria-label={label}
        data-active={active ? "true" : "false"}
        className={cn(
          "inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase transition-[transform,background-color,border-color,color] duration-150 ease-out hover:border-accent hover:text-bone active:scale-[0.96] disabled:opacity-40",
          active && "border-accent text-accent-hot",
          className,
        )}
        {...rest}
      >
        <BatEmblem className="h-3 w-7 fill-current" />
        {hideLabel ? null : <span>{label}</span>}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        data-active={active ? "true" : "false"}
        className={cn(
          "bat-btn h-11 w-11 text-muted",
          className,
        )}
        {...rest}
      >
        <BatEmblem className="h-4 w-9 fill-current" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-active={active ? "true" : "false"}
      className={cn("bat-btn min-w-[4.5rem] px-1 py-2", className)}
      {...rest}
    >
      <BatEmblem className="h-[1.35rem] w-[2.9rem] fill-current sm:h-6 sm:w-14" />
      {hideLabel ? null : (
        <span className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase">
          {label}
        </span>
      )}
    </button>
  );
}
