import type { Metadata } from "next";
import { ProductsHero } from "@/features/products/ProductsHero";
import { ProductCatalog } from "@/features/products/ProductCatalog";
import { PRODUCTS } from "@/lib/products";
import { SITE, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Explore the AURORA collection of luxury over-ear headphones — from the beryllium-driven Phantom One flagship to the everyday Core. Engineered for silence.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "The AURORA Collection",
    description:
      "Luxury over-ear headphones engineered for silence. Beryllium drivers, machined aluminium, adaptive spatial audio.",
    url: `${SITE_URL}/products`,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "The AURORA Collection" }],
  },
};

/** ItemList structured data for the collection — rich results eligibility. */
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "The AURORA Collection",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      description: p.tagline,
      category: p.category,
      url: `${SITE_URL}/products/${p.slug}`,
      image: `${SITE_URL}${p.gallery[0]!.src}`,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: p.price,
        availability: "https://schema.org/InStock",
      },
    },
  })),
};

export default function ProductsPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ProductsHero />
      <ProductCatalog />
    </main>
  );
}
