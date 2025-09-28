"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { useCart } from "@/contexts/cart-context";
import { toSlug } from "@/lib/product-slug";
import { Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-default-500">Loading cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <CartContent />;
}

function CartContent() {
  const { items, removeFromCart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  // Generate checkout URL for cart items
  const getCheckoutUrl = () => {
    if (items.length === 0) {
      return "/products"; // No items, redirect to products
    }

    if (items.length === 1) {
      // Single item - use slug-based checkout
      const product = items[0].product;
      const productId = product.product_id || product.id;
      const slug = toSlug(product.name || String(productId));
      return `/checkout?slug=${slug}`;
    }

    // Multiple items - use cart-based checkout
    return "/checkout?cart=true";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardBody className="text-center p-12">
              <ShoppingCart className="mx-auto mb-4 text-default-300" size={48} />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-default-500 mb-6">
                Add some amazing digital products to get started!
              </p>
              <Button as={Link} href="/products" color="primary">
                Browse Products
              </Button>
            </CardBody>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-foreground/70">
              Review your items before checkout
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const productId = item.product.product_id || item.product.id || "";
                const price = item.product.price || item.product.default_price || 0;

                return (
                  <Card key={productId}>
                    <CardBody className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-default-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-8 opacity-80"
                            />
                          ) : (
                            <ShoppingCart className="text-default-400" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-sm text-default-500 mt-1">
                            {item.product.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-medium">
                              ${(price / 100).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-default-500">
                                Qty: {item.quantity}
                              </span>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onClick={() => removeFromCart(productId)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}

              <div className="flex justify-between">
                <Button
                  variant="light"
                  color="danger"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button as={Link} href="/products" variant="flat">
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardBody className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>

                  <Button
                    as={Link}
                    href={getCheckoutUrl()}
                    color="primary"
                    className="w-full"
                    size="lg"
                  >
                    {items.length === 1
                      ? "Proceed to Checkout"
                      : `Checkout All Items (${items.length})`
                    }
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-default-500">
                      Secure checkout powered by Dodo Payments
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}