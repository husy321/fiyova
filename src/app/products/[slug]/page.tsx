import { notFound } from "next/navigation";
import { ProductActions } from "@/components/products/product-actions";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { buildSlugMap } from "@/lib/product-slug";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getAllProducts();

  const { slugToId } = buildSlugMap(products);
  const productId = slugToId.get(slug) ?? slug;
  const product = products.find((p: Product) => (p.product_id ?? p.id) === productId);

  if (!product) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-default-100 p-6">
          <div className="aspect-square w-full rounded bg-default-100 flex items-center justify-center overflow-hidden">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name || 'Product'} className="w-full h-full object-cover" />
            ) : null}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-foreground/70">{product.description}</p>
          <div className="mt-4 text-lg font-medium">${(product.price ?? 0) / 100}</div>
          <ProductActions slug={slug} product={product} />
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}


