"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/types";
import { ShoppingCart, Check } from "lucide-react";

type ProductActionsProps = {
  slug: string;
  product?: Product;
  backHref?: string;
};

export function ProductActions({ slug, product, backHref = "/products" }: ProductActionsProps) {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is already in cart
  const isInCart = product && items.some(item =>
    (item.product.product_id || item.product.id) === (product.product_id || product.id)
  );

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(product);

    // Show feedback for a moment
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div id="buy" className="mt-6 flex gap-3">
      <Button as={Link} href={`/checkout?slug=${slug}`} color="primary" variant="shadow">
        Buy now
      </Button>
      {product && (
        <Button
          onClick={handleAddToCart}
          variant="flat"
          color={isInCart ? "success" : "default"}
          startContent={
            isAdding ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isInCart ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )
          }
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : isInCart ? "In Cart" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
}


