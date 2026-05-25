"use client";

import { CartProvider } from "@/store/cart";
import { FlyTargetProvider } from "@/store/fly-target";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Navbar } from "@/components/ui/Navbar";
import { getProductBySlug, PRODUCTS } from "@/lib/products";

/** O(1) id → product map for cart hydration (slugs == ids here, but keep explicit). */
const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
const resolveProduct = (id: string) => BY_ID.get(id) ?? getProductBySlug(id);

/**
 * Client-side app shell: cart + fly-to-cart context for the whole site, plus
 * the always-mounted cart drawer. Wraps every route via the root layout.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider resolveProduct={resolveProduct}>
      <FlyTargetProvider>
        <Navbar />
        {children}
        <CartDrawer />
      </FlyTargetProvider>
    </CartProvider>
  );
}
