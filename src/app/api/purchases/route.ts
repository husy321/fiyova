import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { resolvePaymentDetails } from "@/lib/dodo-payment-details";

interface DodoItem {
  product_id?: string;
  license_key?: string;
}

interface DodoPayment {
  payment_id?: string;
  id?: string;
  total_amount?: number;
  amount?: number;
  currency?: string;
  status?: string;
  created_at?: string;
  license_key?: string;
  product_cart?: DodoItem[];
}

interface Purchase {
  payment_id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  download_url: string | null;
  license_key: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = getDodoClient();

    let customerId: string | null = null;
    try {
      const customers = await client.customers.list({ email });
      const items = (customers as { items?: { customer_id?: string; id?: string }[] }).items ?? [];
      if (items.length > 0) {
        customerId = items[0].customer_id ?? items[0].id ?? null;
      }
    } catch (error) {
      console.error("Failed to list customers:", error);
    }

    if (!customerId) {
      return NextResponse.json({ purchases: [] });
    }

    const purchases: Purchase[] = [];

    try {
      for await (const payment of client.payments.list({ customer_id: customerId })) {
        const p = payment as DodoPayment;
        const details = await resolvePaymentDetails(p);

        purchases.push({
          payment_id: p.payment_id ?? p.id ?? "",
          product_name: details.productName,
          amount: p.total_amount ?? p.amount ?? 0,
          currency: p.currency ?? "USD",
          status: p.status ?? "unknown",
          created_at: p.created_at ?? new Date().toISOString(),
          download_url: details.downloadUrl ?? null,
          license_key: p.license_key ?? p.product_cart?.[0]?.license_key ?? null,
        });
      }
    } catch (error) {
      console.error("Failed to list payments:", error);
    }

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Purchases API error:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
