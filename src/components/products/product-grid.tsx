"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ProductCardActions } from "@/components/products/product-card-actions";
import { buildSlugMap, toSlug } from "@/lib/product-slug";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="text-center text-foreground/70">No products available.</p>;
  }

  const { idToSlug } = buildSlugMap(products);
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {products.map((p: Product) => {
        const id = p.product_id ?? p.id;
        const slug = idToSlug.get(id) ?? toSlug(p.name ?? String(id));
        return (
          <Card key={id} className="group w-[300px] h-[300px] border border-transparent transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl">
            <CardBody className="p-0">
              <div className="h-40 rounded-t-xl bg-default-100 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name || 'Product'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : null}
              </div>
            </CardBody>
            <CardHeader className="flex-col items-start px-4 pb-4">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-base font-semibold transition-colors duration-300 group-hover:text-primary">{p.name}</h4>
                <span className="text-sm text-default-500">${(p.price ?? p.default_price ?? 0) / 100}</span>
              </div>
              <p className="mt-1 text-sm text-default-500 line-clamp-2">{p.description}</p>
              <ProductCardActions slug={slug} product={p} />
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
