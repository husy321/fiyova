import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;

    // Use REST API to get individual product
    const mode = process.env.DODO_MODE === "live" ? "live" : "test";
    const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");

    const res = await fetch(`${base}/products/${resolvedParams.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Product not found: ${res.status}` }, { status: 404 });
    }

    const product = await res.json();
    return NextResponse.json({ product }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


