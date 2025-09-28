"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

type ProductCardActionsProps = {
  slug: string;
};

export function ProductCardActions({ slug }: ProductCardActionsProps) {
  return (
    <div className="mt-3 flex gap-2">
      <Button as={Link} href={`/products/${slug}`} variant="flat" size="sm">View</Button>
      <Button as={Link} href={`/checkout?slug=${slug}`} color="primary" variant="shadow" size="sm">Buy</Button>
    </div>
  );
}


