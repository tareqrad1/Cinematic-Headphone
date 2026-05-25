"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/config";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/cart/CartButton";

const HOME_LINKS = [
  { label: "Story", href: "/#story" },
  { label: "Immersive", href: "/#immersive" },
  { label: "Shop", href: "/products" },
] as const;

const INNER_LINKS = [
  { label: "Collection", href: "/products" },
  { label: "Story", href: "/#story" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const links = onHome ? HOME_LINKS : INNER_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-all duration-700 ease-cinematic",
        scrolled || !onHome
          ? "border-b border-white/5 bg-void/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-luxe flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-xl tracking-luxe text-platinum md:text-2xl"
        >
          {BRAND.name}
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs uppercase tracking-wide2 text-mist transition-colors duration-300 hover:text-platinum"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/products"
            className="btn-luxe !hidden !px-6 !py-2.5 !text-xs sm:!inline-flex"
          >
            Shop
          </Link>
          <CartButton />
        </div>
      </nav>
    </header>
  );
}
