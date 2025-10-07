"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

type ProductCardActionsProps = {
  slug: string;
  product: Product;
};

export function ProductCardActions({ slug, product }: ProductCardActionsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="mt-3 flex gap-2 w-full">
      <Button as={Link} href={`/products/${slug}`} variant="flat" size="sm" className="flex-1">
        View
      </Button>
      <Button
        onPress={handleAddToCart}
        variant="bordered"
        size="sm"
        isIconOnly
        aria-label="Add to cart"
      >
        <ShoppingCart className="w-4 h-4" />
      </Button>
      <Button as={Link} href={`/checkout?slug=${slug}`} color="primary" variant="shadow" size="sm" className="flex-1">
        Buy
      </Button>
    </div>
  );
}


