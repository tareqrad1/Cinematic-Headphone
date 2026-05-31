"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { BRAND } from "@/lib/config";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/cart/CartButton";

const HOME_LINKS = [
  { label: "Story",     href: "/#story" },
  { label: "Immersive", href: "/#immersive" },
  { label: "Collection", href: "/products" },
] as const;

const INNER_LINKS = [
  { label: "Collection", href: "/products" },
  { label: "Story",      href: "/#story" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname   = usePathname();
  const onHome     = pathname === "/";
  const links      = onHome ? HOME_LINKS : INNER_LINKS;
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRef       = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* magnetic underline follows hovered nav link */
  function handleLinkEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const indicator = indicatorRef.current;
    if (!indicator || !navRef.current) return;
    const rect    = e.currentTarget.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - navRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  }

  function handleNavLeave() {
    gsap.to(indicatorRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.in",
    });
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-all duration-700 ease-cinematic",
        scrolled || !onHome
          ? "border-b border-white/[0.06] bg-void/75 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-luxe flex h-16 items-center justify-between md:h-20">

        {/* ── brand ── */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          {/* gold dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-70
                           transition-all duration-500 group-hover:opacity-100
                           group-hover:shadow-[0_0_8px_2px_rgba(200,164,92,0.6)]" />
          <span className="font-display text-xl tracking-luxe text-platinum
                           transition-colors duration-300 group-hover:text-gold
                           md:text-2xl">
            {BRAND.name}
          </span>
        </Link>

        {/* ── desktop nav ── */}
        <ul
          ref={navRef}
          onMouseLeave={handleNavLeave}
          className="relative hidden items-center gap-10 md:flex"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onMouseEnter={handleLinkEnter}
                className={cn(
                  "text-xs uppercase tracking-wide2 transition-colors duration-300 hover:text-platinum",
                  pathname === link.href ? "text-platinum" : "text-mist/60",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* magnetic underline indicator */}
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute -bottom-1 left-0 h-px
                       bg-gradient-to-r from-gold/60 via-gold to-gold/60 opacity-0"
            style={{ width: 0 }}
          />
        </ul>

        {/* ── right actions ── */}
        <div className="flex items-center gap-2 md:gap-3">


          {/* cart icon (always visible, links to /cart) */}
          <CartButton />
        </div>
      </nav>
    </header>
  );
}
