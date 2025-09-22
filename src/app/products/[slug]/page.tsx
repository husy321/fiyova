import { notFound } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";

type PageProps = {
  params: { slug: string };
};

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
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
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-foreground/70">{product.description}</p>
          <div className="mt-4 text-lg font-medium">{product.price}</div>
          <div id="buy" className="mt-6 flex gap-3">
            <Button color="primary" variant="shadow">Buy now</Button>
            <Button as={Link} href="/products" variant="flat">Back to products</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


