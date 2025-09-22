import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Logos, Footer } from "@/components/site/sections";
import { Products } from "@/components/site/sections";

async function getProducts() {
  try {
    // Use relative URL for server-side rendering
    const url = "/api/dodo/products";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return [] as any[];
    }
    const data = await res.json();
    return (data.products || []) as any[];
  } catch (error) {
    return [] as any[];
  }
}

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Hero />
        <Logos />
        <Products products={products} />
      </main>
      <Footer />
    </div>
  );
}
