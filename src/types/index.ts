export interface SequenceConfig {
  /** total number of frames in the sequence */
  readonly frameCount: number;
  /** resolves a frame index (0-based) to its public URL */
  readonly getFrameUrl: (index: number) => string;
  /** native frame width in pixels */
  readonly width: number;
  /** native frame height in pixels */
  readonly height: number;
}

export interface StorySection {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly stat?: { readonly value: string; readonly label: string };
}

export type LoadState = "idle" | "loading" | "ready";

/** Target transform for the persistent product at one story chapter. */
export interface ProductTransform {
  /** horizontal offset from centre, in viewport-width units (vw) */
  readonly xVW: number;
  /** vertical offset from centre, in viewport-height units (vh) */
  readonly yVH: number;
  readonly scale: number;
  /** z-rotation in degrees (kept subtle) */
  readonly rotate: number;
}

export interface StoryChapter {
  readonly id: string;
  readonly index: string; // "01" | "02" | "03"
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  /** which side the copy sits on, so it never overlaps the product */
  readonly align: "left" | "right";
  /** where the shared product travels to for this chapter */
  readonly product: ProductTransform;
}
