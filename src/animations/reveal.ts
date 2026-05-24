import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealOptions {
  /** elements to stagger in */
  targets: gsap.TweenTarget;
  /** scroll trigger element */
  trigger: Element;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Cinematic upward reveal with a slight blur lift — the house style used by
 * every text block on the site. Returns the created ScrollTrigger for cleanup.
 */
export function scrollReveal({
  targets,
  trigger,
  start = "top 78%",
  y = 48,
  stagger = 0.12,
  duration = 1.1,
}: RevealOptions): gsap.core.Tween {
  return gsap.from(targets, {
    y,
    opacity: 0,
    filter: "blur(12px)",
    duration,
    stagger,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none reverse",
    },
  });
}

export { ScrollTrigger };
