"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@heroui/react";
import { buildSlugMap, toSlug } from "@/lib/product-slug";
import { useEffect, useState } from "react";

export function Logos() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-black/5 dark:bg-white/10" />
        ))}
      </div>
    </section>
  );
}

export function Products({ products = [] }: { products?: any[] }) {
  const [clientProducts, setClientProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      fetch("/api/dodo/products")
        .then(res => res.json())
        .then(data => {
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
          <p className="mt-2 text-foreground/70">Loading products...</p>
        </div>
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clientProducts.map((p: any) => {
          const id = p.product_id ?? p.id;
          const slug = idToSlug.get(id) ?? toSlug(p.name ?? String(id));
          return (
          <Card key={id}>
            <CardContent className="p-0">
              <div className="h-40 rounded-t-xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-10 opacity-80" />
                ) : null}
              </div>
            </CardContent>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <span className="text-sm text-foreground/80">${(p.price ?? p.default_price ?? 0) / 100}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{p.description}</p>
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
    <footer className="border-t border-black/10 py-12 text-sm text-foreground/70 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded bg-foreground" />
          <span>© {new Date().getFullYear()} Fiyova</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
        </div>
      </div>
    </footer>
  );
}


