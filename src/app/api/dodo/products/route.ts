import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

export async function GET() {
  try {
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      return NextResponse.json({ error: "Missing DODO_PAYMENTS_API_KEY" }, { status: 500 });
    }
    
    console.log("API Key found, length:", process.env.DODO_PAYMENTS_API_KEY?.length);
    console.log("DODO_MODE:", process.env.DODO_MODE);
    
    const client = getDodoClient();
    // Primary: SDK
    try {
      console.log("Trying SDK products.list()");
      const response = await client.products.list();
      console.log("SDK response:", response);
      const products = response?.items || response || [];
      return NextResponse.json({ products }, { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    } catch (sdkErr) {
      console.log("SDK failed, trying REST fallback:", sdkErr);
      // Fallback: direct REST
      const mode = process.env.DODO_MODE === "live" ? "live" : "test";
      const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");
      console.log("REST URL:", `${base}/products`);
      console.log("Auth header:", `Bearer ${process.env.DODO_PAYMENTS_API_KEY?.substring(0, 10)}...`);
      
      const res = await fetch(`${base}/products`, {
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
      const products = response?.items || response || [];
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


