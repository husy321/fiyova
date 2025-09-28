"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { buildSlugMap } from "@/lib/product-slug";
import { Product, ProductsApiResponse } from "@/types";

function CheckoutContent() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Load product info on mount
  useEffect(() => {
    async function loadProduct() {
      try {
        const productList: ProductsApiResponse = await fetch("/api/dodo/products", { cache: "no-store" }).then((r) => r.json());
        const products = productList.products || [];
        const { slugToId } = buildSlugMap(products);
        const productId = slugToId.get(slug);
        if (productId) {
          const match = products.find((p: Product) => (p.product_id ?? p.id) === productId);
          setProduct(match || null);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      // Get products and build slug mapping
      const productList: ProductsApiResponse = await fetch("/api/dodo/products", { cache: "no-store" }).then((r) => r.json());
      const products = productList.products || [];
      const { slugToId } = buildSlugMap(products);

      // Find product by slug using the same mapping logic
      const productId = slugToId.get(slug);
      if (!productId) {
        console.log("Available slugs:", Array.from(slugToId.keys()));
        console.log("Looking for slug:", slug);
        throw new Error(`Product not found for slug: ${slug}`);
      }

      const match = products.find((p: Product) => (p.product_id ?? p.id) === productId);
      if (!match) throw new Error("Product not found");

      // Optionally create customer first
      const customer = email && name ? { email, name } : undefined;

      const res = await fetch("/api/dodo/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: match.product_id ?? match.id, quantity: 1, customer }),
      });
      const { payment, error } = await res.json();
      if (error) throw new Error(error);

      console.log("Payment response:", payment);
      console.log("Payment keys:", Object.keys(payment || {}));

      // Try different possible field names for the payment link
      const paymentLink = payment?.payment_link_url ||
                         payment?.payment_link ||
                         payment?.checkout_url ||
                         payment?.url ||
                         payment?.link;

      if (paymentLink) {
        console.log("Redirecting to payment link:", paymentLink);
        window.location.href = paymentLink;
      } else {
        console.log("Available payment fields:", payment);
        throw new Error("Missing payment link - available fields: " + Object.keys(payment || {}).join(", "));
      }
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message || "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      {product ? (
        <div className="mt-2 p-4 border rounded-lg">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-foreground/70">{product.description}</p>
          <p className="text-lg font-semibold">${(product.price ?? 0) / 100}</p>
        </div>
      ) : (
        <p className="mt-1 text-foreground/70">Product: {slug || "(unknown)"}</p>
      )}
      <div className="mt-6 grid gap-3">
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button isLoading={loading} color="primary" onPress={handleCheckout}>Pay</Button>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-24 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}


