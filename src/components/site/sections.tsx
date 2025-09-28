"use client";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ProductSkeleton } from "@/components/ui/product-skeleton";
import { buildSlugMap, toSlug } from "@/lib/product-slug";
import { useEffect, useState } from "react";
import { Product, ProductsApiResponse } from "@/types";

export function Products({ products = [] }: { products?: Product[] }) {
  const [clientProducts, setClientProducts] = useState<Product[]>(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      fetch("/api/dodo/products")
        .then(res => res.json())
        .then((data: ProductsApiResponse) => {
          setClientProducts(data.products || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching products:", err);
          setLoading(false);
        });
    }
  }, [products.length]);

  const { idToSlug } = buildSlugMap(clientProducts);
  
  if (loading) {
    return (
      <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Products</h2>
          <p className="mt-2 text-foreground/70">One-time purchase. Instant download.</p>
        </div>
        <ProductSkeleton count={8} />
      </section>
    );
  }

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Products</h2>
        <p className="mt-2 text-foreground/70">One-time purchase. Instant download.</p>
      </div>
      {clientProducts.length === 0 ? (
        <p className="text-center text-foreground/70">No products available.</p>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clientProducts.map((p: Product) => {
          const id = p.product_id ?? p.id;
          const slug = idToSlug.get(id) ?? toSlug(p.name ?? String(id));
          return (
          <Card key={id} className="max-w-[400px]">
            <CardBody className="p-0">
              <div className="h-40 rounded-t-xl bg-default-100 flex items-center justify-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-10 opacity-80" />
                ) : null}
              </div>
            </CardBody>
            <CardHeader className="flex-col items-start px-4 pb-4">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-base font-semibold">{p.name}</h4>
                <span className="text-sm text-default-500">${(p.price ?? p.default_price ?? 0) / 100}</span>
              </div>
              <p className="mt-1 text-sm text-default-500 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex gap-2">
                <Button as={Link} href={`/products/${slug}`} color="primary" variant="shadow" size="sm">View</Button>
                <Button as={Link} href={`/checkout?slug=${slug}`} variant="flat" size="sm">Buy</Button>
              </div>
            </CardHeader>
          </Card>
          );
        })}
      </div>
      )}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-default-200 py-12 text-sm text-default-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image src="/fiyova-logo.svg" alt="Fiyova" width={24} height={24} className="size-6" />
          <span className="font-medium">© {new Date().getFullYear()} Fiyova</span>
        </div>
        <div className="flex gap-6">
          <a href="/terms" className="hover:text-foreground transition-colors rounded-full px-3 py-1 hover:bg-default-100">
            Terms
          </a>
          <a href="/faq" className="hover:text-foreground transition-colors rounded-full px-3 py-1 hover:bg-default-100">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}


