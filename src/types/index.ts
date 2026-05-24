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
