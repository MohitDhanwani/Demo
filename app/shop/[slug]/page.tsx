import { notFound } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) return { title: "Product Not Found — SLOW TIDE" };

    return {
      title: `${product.name} (${product.originCountry}) — SLOW TIDE Roasters`,
      description: product.description,
      openGraph: {
        title: `${product.name} — SLOW TIDE Coffee Roasters`,
        description: `${product.originCountry} · ${product.process} · ${product.tastingNotes.join(", ")}`,
        images: [product.images[0]],
      },
    };
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Cross-sell recommendations
  const pairsWellWith = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === "gear" || p.category === "single-origin")
  ).slice(0, 4);

  return <ProductDetailClient product={product} pairsWellWith={pairsWellWith} />;
}
