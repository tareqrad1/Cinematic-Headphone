import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SLUGS, PRODUCTS, getProductBySlug } from "@/lib/products";
import { SITE_URL } from "@/lib/config";
import { ProductDetail } from "@/features/products/ProductDetail";
import { RelatedProducts } from "@/features/products/RelatedProducts";

interface PageProps {
  params: { slug: string };
}

/** Pre-render every product at build time (fully static, instant nav). */
export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Not found" };

  const url = `${SITE_URL}/products/${product.slug}`;
  const image = `${SITE_URL}${product.gallery[0]!.src}`;
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`.slice(0, 160),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — AURORA`,
      description: product.tagline,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — AURORA`,
      description: product.tagline,
      images: [image],
    },
  };
}

/** Up to 3 siblings: same category first, then fill from the rest. */
function relatedFor(slug: string) {
  const current = getProductBySlug(slug)!;
  const sameCategory = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  const rest = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...rest].slice(0, 3);
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    color: product.colorName,
    brand: { "@type": "Brand", name: "AURORA" },
    image: product.gallery.map((g) => `${SITE_URL}${g.src}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  return (
    <main className="relative min-h-screen bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} />
      <RelatedProducts products={relatedFor(product.slug)} />
    </main>
  );
}
