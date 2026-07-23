import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export async function GET() {
  try {
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      return NextResponse.json({ error: "Missing DODO_PAYMENTS_API_KEY" }, { status: 500 });
    }

    // Primary: shared cached loader (SDK with auto-pagination + revalidation)
    try {
      const products = await getAllProducts();
      if (products.length > 0) {
        return NextResponse.json({ products }, {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
          }
        });
      }
      // Empty result: fall through to the REST fallback below in case the
      // cached SDK call silently failed on a prior request.
      throw new Error("No products from cached loader");
    } catch (sdkErr) {
      console.log("SDK/cache failed, trying REST fallback:", sdkErr);
      // Fallback: direct REST with manual pagination
      const mode = process.env.DODO_MODE === "live" ? "live" : "test";
      const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");

      const products: unknown[] = [];
      const pageSize = 100;
      let pageNumber = 0;
      while (true) {
        const url = `${base}/products?page_size=${pageSize}&page_number=${pageNumber}`;
        console.log("REST URL:", url);
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
            'Content-Type': 'application/json'
          },
          cache: "no-store",
        });

        console.log("REST response status:", res.status);
        if (!res.ok) {
          const text = await res.text();
          console.log("REST error response:", text);
          return NextResponse.json({ error: `Products fetch failed: ${res.status} ${text}` }, { status: 500 });
        }
        const response = await res.json();
        const items = response?.items || response || [];
        products.push(...items);
        if (items.length < pageSize) break;
        pageNumber++;
      }
      console.log("REST products count:", products.length);
      return NextResponse.json({ products }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.log("Unexpected error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


