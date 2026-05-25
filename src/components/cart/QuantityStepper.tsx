"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}

/** Hairline +/− stepper with disabled bounds. Pure, controlled. */
export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  size = "sm",
}: QuantityStepperProps) {
  const dim = size === "sm" ? "h-8 w-8 text-sm" : "h-11 w-11 text-base";
  const btn =
    "flex items-center justify-center text-mist transition-colors duration-300 hover:text-platinum disabled:opacity-30 disabled:hover:text-mist";

  return (
    <div className="inline-flex items-center rounded-full border border-white/10">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={`${btn} ${dim}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon className="text-[1.1em]" />
      </button>
      <span
        className="min-w-[2ch] text-center text-sm tabular-nums text-platinum"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={`${btn} ${dim}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon className="text-[1.1em]" />
      </button>
    </div>
  );
}
