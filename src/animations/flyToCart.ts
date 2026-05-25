import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Premium "fly-to-cart" flourish. Clones the source product image, fixes it
 * over its on-screen position, then arcs it toward the cart target with a
 * scale-down + fade, finishing with a tactile pulse on the cart icon.
 *
 * Pure DOM + GSAP — no React re-render. The clone is removed on completion.
 * No-ops under prefers-reduced-motion (the cart-icon pulse still fires so the
 * add is acknowledged).
 */
export function flyToCart(source: HTMLElement, target: HTMLElement): void {
  const pulse = () =>
    gsap.fromTo(
      target,
      { scale: 1 },
      { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
    );

  if (prefersReducedMotion()) {
    pulse();
    return;
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0 || to.width === 0) {
    pulse();
    return;
  }

  const clone = source.cloneNode(true) as HTMLElement;
  const startSize = Math.min(from.width, 220);
  const ratio = from.height / from.width;

  Object.assign(clone.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${startSize}px`,
    height: `${startSize * ratio}px`,
    margin: "0",
    borderRadius: "14px",
    objectFit: "contain",
    pointerEvents: "none",
    zIndex: "120",
    willChange: "transform, opacity",
    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
  } satisfies Partial<CSSStyleDeclaration>);

  document.body.appendChild(clone);

  const targetCenterX = to.left + to.width / 2;
  const targetCenterY = to.top + to.height / 2;
  const dx = targetCenterX - (from.left + startSize / 2);
  const dy = targetCenterY - (from.top + (startSize * ratio) / 2);

  const tl = gsap.timeline({
    onComplete: () => {
      clone.remove();
      pulse();
    },
  });

  // Arc: ascend slightly, then dive into the cart while shrinking + fading.
  tl.to(clone, {
    x: dx * 0.5,
    y: dy * 0.5 - 60,
    scale: 0.5,
    duration: 0.4,
    ease: "power2.out",
  }).to(clone, {
    x: dx,
    y: dy,
    scale: 0.06,
    opacity: 0.2,
    duration: 0.42,
    ease: "power2.in",
  });
}
