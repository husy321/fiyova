import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/sections";
import { Products } from "@/components/site/sections";
import { Product, ProductsApiResponse } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    // Use relative URL for server-side rendering
    const url = "/api/dodo/products";
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
