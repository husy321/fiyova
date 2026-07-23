import { unstable_cache } from "next/cache";
import { getDodoClient } from "@/lib/dodo";
import { Product } from "@/types";

// Fetch the full catalog straight from the Dodo SDK (server-side only).
async function fetchAllProducts(): Promise<Product[]> {
  const client = getDodoClient();
  const products: Product[] = [];
  for await (const product of client.products.list({ page_size: 100 })) {
    products.push(product as unknown as Product);
  }
  return products;
}

/**
 * Cached product loader shared by the product pages.
 *
 * Results are cached across requests and revalidated periodically, so repeat
 * visits are served instantly instead of hitting Dodo's API every time. The
 * catalog changes rarely, so a short revalidation window is a safe trade-off.
 */
export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      return await fetchAllProducts();
    } catch (err) {
      console.error("Failed to load products from Dodo:", err);
      return [];
    }
  },
  ["dodo-products"],
  { revalidate: 60, tags: ["products"] }
);
