"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ProductCardActions } from "@/components/products/product-card-actions";
import { ProductSkeleton } from "@/components/ui/product-skeleton";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { buildSlugMap, toSlug } from "@/lib/product-slug";
import { useEffect, useState } from "react";
import { Product, ProductsApiResponse } from "@/types";

async function getProducts(): Promise<Product[]> {
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
      return [];
    }

    const data: ProductsApiResponse = await res.json();
    console.log("API response data:", data);
    console.log("Products array:", data.products);
    console.log("Products count:", data.products?.length || 0);

    return data.products || [];
  } catch (error) {
    console.log("Error fetching products:", error);
    return [];
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All products</h1>
            <p className="mt-2 text-foreground/70">Browse our catalog and pick what you need.</p>
          </div>
          <ProductSkeleton count={12} />
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { idToSlug } = buildSlugMap(products);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All products</h1>
        <p className="mt-2 text-foreground/70">Browse our catalog and pick what you need.</p>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-foreground/70">No products available.</p>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p: Product) => {
          const id = p.product_id ?? p.id;
          const slug = idToSlug.get(id) ?? toSlug(p.name ?? String(id));
          return (
          <Card key={id} className="max-w-[400px]">
            <CardBody className="p-0">
              <div className="h-40 rounded-t-xl bg-default-100 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name || 'Product'} className="w-full h-full object-cover" />
                ) : null}
              </div>
            </CardBody>
            <CardHeader className="flex-col items-start px-4 pb-4">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-base font-semibold">{p.name}</h4>
                <span className="text-sm text-default-500">${(p.price ?? p.default_price ?? 0) / 100}</span>
              </div>
              <p className="mt-1 text-sm text-default-500">{p.description}</p>
              <ProductCardActions slug={slug} product={p} />
            </CardHeader>
          </Card>
          );
        })}
      </div>
      )}
      </div>
      </main>
      <Footer />
    </div>
  );
}


