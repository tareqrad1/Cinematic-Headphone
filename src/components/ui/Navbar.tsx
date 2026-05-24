"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/config";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Sound", href: "#sound" },
  { label: "Engineering", href: "#engineering" },
  { label: "Materials", href: "#materials" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cinematic",
        scrolled
          ? "border-b border-white/5 bg-void/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-luxe flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          className="font-display text-xl tracking-luxe text-platinum md:text-2xl"
        >
          {BRAND.name}
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs uppercase tracking-wide2 text-mist transition-colors duration-300 hover:text-platinum"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#cta" className="btn-luxe !px-6 !py-2.5 !text-xs">
          Reserve
        </a>
      </nav>
    </header>
  );
}
