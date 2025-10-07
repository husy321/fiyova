"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { buildSlugMap } from "@/lib/product-slug";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Product, ProductsApiResponse } from "@/types";
import { countries } from "@/lib/countries";

function CheckoutContent() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const isCartCheckout = params.get("cart") === "true";
  const { items: cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("MV");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Auto-populate user info if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
    }
  }, [user]);

  // Load product info on mount
  useEffect(() => {
    async function loadProduct() {
      try {
        if (isCartCheckout) {
          console.log("Cart checkout mode - using cart items");
          return;
        }

        console.log("Loading product for slug:", slug);
        const response = await fetch("/api/dodo/products", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const productList: ProductsApiResponse = await response.json();
        const products = productList.products || [];
        console.log("Available products:", products.length);

        const { slugToId } = buildSlugMap(products);
        console.log("Available slugs:", Array.from(slugToId.keys()));

        const productId = slugToId.get(slug) ?? slug; // Fallback to slug as product ID
        console.log("Resolved product ID:", productId);

        if (productId) {
          const match = products.find((p: Product) => (p.product_id ?? p.id) === productId);
          console.log("Found product:", match);
          setProduct(match || null);
        } else {
          console.warn("No product ID found for slug:", slug);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError(`Failed to load product: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    if (slug || isCartCheckout) {
      loadProduct();
    } else {
      console.warn("No slug provided in URL and not cart checkout");
    }
  }, [slug, isCartCheckout]);

  // If no slug and not cart checkout, show a message to select a product
  if (!slug && !isCartCheckout) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-4 p-4 border rounded-lg bg-warning-50 border-warning-200">
          <p className="text-warning-800 font-medium">No product selected</p>
          <p className="text-warning-700 text-sm mt-1">
            Please select a product from our catalog to proceed with checkout.
          </p>
        </div>
        <div className="mt-6">
          <Button as={Link} href="/products" color="primary" size="lg" className="w-full">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      // Optionally create customer first
      const customer = email && name ? { email, name } : undefined;

      // Build billing address
      const billing = {
        city: city || "Unknown",
        country: country,
        state: state || "Unknown",
        street: address || "Unknown",
        zipcode: zipcode || "00000"
      };

      if (isCartCheckout) {
        // Multi-item cart checkout
        if (cartItems.length === 0) {
          throw new Error("No items in cart");
        }

        const product_cart = cartItems.map(item => ({
          product_id: item.product.product_id || item.product.id,
          quantity: item.quantity
        }));

        const res = await fetch("/api/dodo/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_cart, customer, billing }),
        });
        const { payment, error } = await res.json();
        if (error) throw new Error(error);

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
      } else {
        // Single product checkout via slug
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

        const res = await fetch("/api/dodo/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: match.product_id ?? match.id, quantity: 1, customer, billing }),
        });
        const { payment, error } = await res.json();
        if (error) throw new Error(error);

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

      {/* Product Display */}
      {isCartCheckout ? (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Items ({cartItems.length})</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="p-3 border rounded-lg bg-default-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                  <p className="text-xs text-foreground/70 mt-1">{item.product.description}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-semibold">${((item.product.price ?? 0) / 100).toFixed(2)}</p>
                  <p className="text-xs text-foreground/70">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="p-3 border rounded-lg bg-primary-50 border-primary-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-lg">${(getCartTotal() / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : product ? (
        <div className="mt-4 p-4 border rounded-lg bg-default-50">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-foreground/70 mt-1">{product.description}</p>
          <p className="text-lg font-semibold mt-2">${(product.price ?? 0) / 100}</p>
        </div>
      ) : slug ? (
        <div className="mt-4 p-4 border rounded-lg bg-warning-50 border-warning-200">
          <p className="text-warning-800">Loading product: {slug}</p>
        </div>
      ) : (
        <div className="mt-4 p-4 border rounded-lg bg-danger-50 border-danger-200">
          <p className="text-danger-800">No product selected. Please select a product first.</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 border rounded-lg bg-danger-50 border-danger-200">
          <p className="text-danger-800 text-sm">{error}</p>
        </div>
      )}

      {/* Checkout Form */}
      <div className="mt-6 grid gap-3">
        {user && (
          <div className="p-3 border rounded-lg bg-success-50 border-success-200">
            <p className="text-success-800 text-sm">✓ Using your account information</p>
          </div>
        )}
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="bordered"
          isRequired
          isReadOnly={!!user}
          description={user ? "From your account" : undefined}
        />
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="bordered"
          isRequired
          isReadOnly={!!user}
          description={user ? "From your account" : undefined}
        />
        <Input
          label="Address"
          placeholder="Street address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="bordered"
          isRequired
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            variant="bordered"
            isRequired
          />
          <Input
            label="State/Province"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            variant="bordered"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Country"
            placeholder="Select country"
            selectedKeys={[country]}
            onChange={(e) => setCountry(e.target.value)}
            variant="bordered"
            isRequired
          >
            {countries.map((c) => (
              <SelectItem key={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Zip/Postal Code"
            placeholder="Zip code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            variant="bordered"
          />
        </div>
        <Button
          isLoading={loading}
          color="primary"
          onPress={handleCheckout}
          isDisabled={isCartCheckout ? cartItems.length === 0 : !product}
          size="lg"
        >
          {isCartCheckout
            ? cartItems.length > 0
              ? `Pay $${(getCartTotal() / 100).toFixed(2)} (${cartItems.length} items)`
              : "No items in cart"
            : product
              ? `Pay $${(product.price ?? 0) / 100}`
              : "Select Product"
          }
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="mx-auto max-w-md px-4 py-16">
            <div className="h-8 bg-default-200 rounded animate-pulse mb-4" />
            <div className="h-24 bg-default-200 rounded animate-pulse mb-6" />
            <div className="space-y-3">
              <div className="h-12 bg-default-200 rounded animate-pulse" />
              <div className="h-12 bg-default-200 rounded animate-pulse" />
              <div className="h-12 bg-default-200 rounded animate-pulse" />
            </div>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


