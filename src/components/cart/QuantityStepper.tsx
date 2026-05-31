"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  size = "sm",
}: QuantityStepperProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  const bump = (next: number) => {
    onChange(next);
    if (!numRef.current) return;
    // micro pop on change
    gsap.fromTo(numRef.current,
      { scale: 0.7, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.28, ease: "back.out(3)" },
    );
  };

  const isSmall = size === "sm";
  const btnSize = isSmall ? "h-7 w-7 text-sm" : "h-10 w-10 text-base";
  const numSize = isSmall ? "text-sm" : "text-base";

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/[0.09]
                 bg-white/[0.03] p-0.5"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => bump(value - 1)}
        className={`${btnSize} flex items-center justify-center rounded-full text-mist/60
                    transition-all duration-200 hover:bg-white/[0.06] hover:text-platinum
                    disabled:cursor-not-allowed disabled:opacity-25`}
      >
        <MinusIcon className="text-[0.9em]" />
      </button>

      <span
        ref={numRef}
        aria-live="polite"
        className={`${numSize} min-w-[2ch] text-center tabular-nums font-medium text-platinum`}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => bump(value + 1)}
        className={`${btnSize} flex items-center justify-center rounded-full text-mist/60
                    transition-all duration-200 hover:bg-white/[0.06] hover:text-platinum
                    disabled:cursor-not-allowed disabled:opacity-25`}
      >
        <PlusIcon className="text-[0.9em]" />
      </button>
    </div>
  );
}
