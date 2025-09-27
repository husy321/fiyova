"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

type ProductActionsProps = {
  slug: string;
  backHref?: string;
};

export function ProductActions({ slug, backHref = "/products" }: ProductActionsProps) {
  return (
    <div id="buy" className="mt-6 flex gap-3">
      <Button as={Link} href={`/checkout?slug=${slug}`} color="primary" variant="shadow">Buy now</Button>
      <Button as={Link} href={backHref} variant="flat">Back to products</Button>
    </div>
  );
}


