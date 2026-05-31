"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { BRAND } from "@/lib/config";

/* ─── Instagram icon ─────────────────────────────────────────────────────── */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─── X (Twitter) icon ───────────────────────────────────────────────────── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.835L2.058 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

/* ─── social link ────────────────────────────────────────────────────────── */
function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onEnter() {
    gsap.to(ref.current, { scale: 1.18, duration: 0.35, ease: "back.out(2)" });
  }
  function onLeave() {
    gsap.to(ref.current, { scale: 1, duration: 0.4, ease: "power2.out" });
  }

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full
                 border border-white/10 bg-white/[0.03] text-mist backdrop-blur-sm
                 transition-colors duration-500 hover:border-gold/50 hover:text-gold"
    >
      {/* glow ring on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0
                       shadow-[0_0_18px_4px_rgba(200,164,92,0.25)]
                       transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10 h-[18px] w-[18px]">{icon}</span>
    </a>
  );
}

/* ─── footer ─────────────────────────────────────────────────────────────── */
function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".ft-reveal");
    gsap.set(items, { opacity: 0, y: 28, filter: "blur(8px)" });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          obs.unobserve(e.target);
          const i = Array.from(items).indexOf(e.target as HTMLElement);
          gsap.to(e.target, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
          });
        });
      },
      { threshold: 0.1 },
    );

    items.forEach((it) => obs.observe(it));
    return () => obs.disconnect();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="relative z-10 mt-28 w-full overflow-hidden border-t border-white/[0.06]"
    >
      {/* ambient glow strip */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(200,164,92,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="container-luxe relative py-14">
        {/* top row */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">

          {/* brand block */}
          <div className="ft-reveal flex flex-col items-center gap-2 md:items-start">
            <span
              className="font-display text-3xl tracking-luxe text-platinum"
              style={{
                background: "linear-gradient(100deg,#e8e9ec 0%,#c8a45c 40%,#e8e9ec 80%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {BRAND.name}
            </span>
            <p className="max-w-[18rem] text-center text-xs leading-relaxed text-mist/50 md:text-left">
              Luxury over-ear headphones — beryllium drivers, machined aluminium, adaptive spatial audio.
            </p>
          </div>

          {/* nav links */}
          <div className="ft-reveal flex flex-col items-center gap-3 md:items-end">
            <span className="kicker mb-1">Navigation</span>
            {[
              { label: "Home", href: "/" },
              { label: "The Collection", href: "/products" },
              { label: "Phantom One", href: "/products/phantom-one" },
              { label: "Checkout", href: "/checkout" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs tracking-wide2 text-mist/60 transition-colors duration-300 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* creator block */}
          <div className="ft-reveal flex flex-col items-center gap-5 md:items-end">
            <div className="flex flex-col items-center gap-1 md:items-end">
              <span className="kicker">Crafted by</span>
              <span className="font-display text-xl text-platinum">Tareq Radi</span>
            </div>

            {/* social icons */}
            <div className="flex items-center gap-3">
              <SocialLink
                href="https://www.instagram.com/dev.tareq/"
                label="Instagram — dev.tareq"
                icon={<InstagramIcon className="h-full w-full" />}
              />
              <SocialLink
                href="https://x.com/v43_w?s=21&t=z098bjKEUv4LodScmHcfhA"
                label="X (Twitter)"
                icon={<XIcon className="h-full w-full" />}
              />
            </div>

            {/* handle labels */}
            <div className="flex flex-col items-center gap-1 md:items-end">
              <a
                href="https://www.instagram.com/dev.tareq/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] tracking-wide2 text-mist/40
                           transition-colors duration-300 hover:text-gold/70"
              >
                <InstagramIcon className="h-3 w-3" />
                @dev.tareq
              </a>
              <a
                href="https://x.com/v43_w?s=21&t=z098bjKEUv4LodScmHcfhA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] tracking-wide2 text-mist/40
                           transition-colors duration-300 hover:text-gold/70"
              >
                <XIcon className="h-3 w-3" />
                @v43_w
              </a>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="ft-reveal my-10 flex items-center gap-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <span
            className="h-1 w-1 rounded-full bg-gold/40"
            style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.25)" }}
          />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* bottom row */}
        <div className="ft-reveal flex flex-col items-center gap-2 text-center text-[11px] tracking-wide2 text-mist/25 sm:flex-row sm:justify-between">
          <span>© {year} {BRAND.name} Acoustics. All rights reserved.</span>
          <span>
            Designed &amp; built by{" "}
            <a
              href="https://www.instagram.com/dev.tareq/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mist/40 transition-colors duration-300 hover:text-gold/60"
            >
              Tareq Radi
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function CallToAction() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // Self-healing reveal. As the LAST section (right after the pinned
      // Finale), a plain scroll-reveal can mis-measure once the pin injects its
      // spacing — and never fire, leaving the opacity-0 copy invisible above the
      // footer. So: hide via JS (CSS resting state stays visible), use a `once`
      // trigger with a forgiving start, and refresh after mount.
      const targets = gsap.utils.toArray<HTMLElement>(".cta-reveal");
      if (targets.length > 0) {
        gsap.set(targets, { y: 60, opacity: 0, filter: "blur(12px)" });
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "opacity,filter,transform",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            once: true,
          },
        });
      }

      gsap.to(root.current!.querySelector(".cta-glow"), {
        scale: 1.25,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Anchor positions once the preceding Finale pin has injected its spacing.
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="cta"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden border-t border-white/5 text-center"
    >
      <div className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,92,0.25),transparent_70%)] opacity-50 blur-2xl" />

      <div className="container-luxe relative z-10 pt-8">
        <span className="cta-reveal kicker">
          {BRAND.product}
        </span>
        <h2 className="cta-reveal display-xl mt-6 text-metallic">
          Hear everything.
        </h2>
        <p className="cta-reveal body-lux mx-auto mt-8 max-w-md">
          Reserve yours today. Limited first edition, individually numbered and
          delivered in a hand-finished case.
        </p>
        <div className="cta-reveal mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/products" className="btn-luxe border-gold text-gold">
            Shop the collection
          </Link>
          <Link href="/products/phantom-one" className="btn-luxe">
            Reserve Phantom One — $899
          </Link>
        </div>
      </div>

      <SiteFooter />
    </section>
  );
}
