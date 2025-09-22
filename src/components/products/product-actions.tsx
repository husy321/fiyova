"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

type ProductActionsProps = {
  backHref?: string;
};

export function ProductActions({ backHref = "/products" }: ProductActionsProps) {
  return (
    <div id="buy" className="mt-6 flex gap-3">
      <Button as={Link} href="/checkout" color="primary" variant="shadow">Buy now</Button>
      <Button as={Link} href={backHref} variant="flat">Back to products</Button>
    </div>
  );
}


