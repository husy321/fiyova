"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductCardActions } from "@/components/products/product-card-actions";
import { buildSlugMap, toSlug } from "@/lib/product-slug";
import { useEffect, useState } from "react";

async function getProducts() {
  try {
    // Use relative URL for client-side fetch
    const url = "/api/dodo/products";
    console.log("Fetching products from:", url);
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("Response status:", res.status);
    if (!res.ok) {
      console.log("Response not ok:", res.status, res.statusText);
      const errorText = await res.text();
      console.log("Error response:", errorText);
      return [] as any[];
    }
    
    const data = await res.json();
    console.log("API response data:", data);
    console.log("Products array:", data.products);
    console.log("Products count:", data.products?.length || 0);
    
    return (data.products || []) as any[];
  } catch (error) {
    console.log("Error fetching products:", error);
    return [] as any[];
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        console.log("Products fetched:", data);
        setProducts(data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  console.log("Products in component:", products);
  console.log("Products length:", products.length);
  
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-foreground/70">Loading products...</p>
        </div>
      </div>
    );
  }

  const { idToSlug } = buildSlugMap(products);
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All products</h1>
        <p className="mt-2 text-foreground/70">Browse our catalog and pick what you need.</p>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-foreground/70">No products available.</p>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => {
          const id = p.product_id ?? p.id;
          const slug = idToSlug.get(id) ?? toSlug(p.name ?? String(id));
          return (
          <Card key={id}>
            <CardContent className="p-0">
              <div className="h-44 rounded-t-xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
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
              <CardDescription className="mt-1">{p.description}</CardDescription>
              <ProductCardActions slug={slug} />
            </CardHeader>
          </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}


