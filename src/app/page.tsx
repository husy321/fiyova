import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/sections";
import { Products } from "@/components/site/sections";
import { Product, ProductsApiResponse } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    // Use full URL for server-side rendering
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://fiyova.co';
    const url = `${baseUrl}/api/dodo/products`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    const data: ProductsApiResponse = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Hero />
        <Products products={products} />
      </main>
      <Footer />
    </div>
  );
}
