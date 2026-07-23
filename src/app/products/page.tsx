import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductSkeleton } from "@/components/ui/product-skeleton";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { getAllProducts } from "@/lib/products";

export const revalidate = 60;

async function ProductGridSection() {
  const products = await getAllProducts();
  return <ProductGrid products={products} />;
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All products</h1>
            <p className="mt-2 text-foreground/70">Browse our catalog and pick what you need.</p>
          </div>
          <Suspense fallback={<ProductSkeleton count={12} />}>
            <ProductGridSection />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
