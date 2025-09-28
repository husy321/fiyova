import { notFound } from "next/navigation";
import { ProductActions } from "@/components/products/product-actions";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { buildSlugMap } from "@/lib/product-slug";
import { Product, ProductsApiResponse } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const url = base ? `${base}/api/dodo/products` : `/api/dodo/products`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data: ProductsApiResponse = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

type PageProps = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: PageProps) {
  const products = await getProducts();
  const { slugToId } = buildSlugMap(products);
  const productId = slugToId.get(params.slug) ?? params.slug;
  const product = products.find((p: Product) => (p.product_id ?? p.id) === productId);
  if (!product) return notFound();

  return (
    <>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
          <div className="aspect-square w-full rounded bg-black/5 dark:bg-white/10 flex items-center justify-center">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="" className="h-14 opacity-80" />
            ) : null}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-foreground/70">{product.description}</p>
          <div className="mt-4 text-lg font-medium">${(product.price ?? 0) / 100}</div>
          <ProductActions slug={params.slug} />
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}


