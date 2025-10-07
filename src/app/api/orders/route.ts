import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('customer_email');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    if (!userEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
    }

    console.log("Fetching payments for customer:", userEmail);

    try {
      const client = getDodoClient();

      // Fetch payments from Dodo SDK
      const paymentsResponse = await client.payments.list({
        page_size: limit,
        page_number: page
      });

      console.log("Payments response:", paymentsResponse);

      // Transform Dodo payments to our Order interface format and filter by customer email
      const allOrders = paymentsResponse?.items?.map((payment) => ({
        id: payment.payment_id,
        product_name: "Payment", // We'll need to fetch line items for actual product names
        amount: payment.total_amount,
        status: mapPaymentStatus(payment.status || 'pending'),
        date: payment.created_at,
        customer_email: payment.customer.email,
        payment_id: payment.payment_id,
        currency: payment.currency,
        items: [],
        download_url: payment.digital_products_delivered ? undefined : undefined // Will need to get from line items
      })) || [];

      // Filter by customer email since the API doesn't support this filter
      const orders = allOrders.filter(order => order.customer_email === userEmail);

      return NextResponse.json({
        orders,
        total: orders.length, // Dodo API doesn't provide total count in list response
        page,
        limit
      });

    } catch (sdkError) {
      console.log("SDK failed, trying REST API:", sdkError);

      // Fallback to REST API
      const mode = process.env.DODO_MODE === "live" ? "live" : "test";
      const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");

      const url = new URL(`${base}/payments`);
      url.searchParams.set('customer_email', userEmail);
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('page', page.toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("REST error response:", text);
        return NextResponse.json({ error: `Failed to fetch payments: ${res.status} ${text}` }, { status: 500 });
      }

      const paymentsData = await res.json();
      console.log("REST payments data:", paymentsData);

      // Handle different response formats
      const payments = paymentsData?.data || paymentsData?.items || paymentsData || [];

      const orders = payments.map((payment: Record<string, unknown>) => ({
        id: (payment.id || payment.payment_id) as string,
        product_name: (payment.product_name || (payment.items as { name?: string }[])?.[0]?.name || "Unknown Product") as string,
        amount: (payment.amount || payment.total_amount || 0) as number,
        status: mapPaymentStatus((payment.status as string) || 'pending'),
        date: (payment.created_at || payment.date || new Date().toISOString()) as string,
        customer_email: ((payment.customer as { email?: string })?.email || userEmail) as string,
        payment_id: (payment.id || payment.payment_id) as string,
        currency: (payment.currency || 'USD') as string,
        items: (payment.items || []) as Record<string, unknown>[],
        download_url: (payment.status === 'succeeded' && (payment.items as { download_url?: string }[])?.[0]?.download_url ? (payment.items as { download_url?: string }[])[0].download_url : undefined) as string | undefined
      }));

      return NextResponse.json({
        orders,
        total: paymentsData?.total || orders.length,
        page,
        limit
      });
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.log("Orders fetch error:", message);
    console.log("Error details:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Helper function to map Dodo payment status to our order status
function mapPaymentStatus(dodoStatus: string): "completed" | "pending" | "failed" {
  switch (dodoStatus?.toLowerCase()) {
    case 'succeeded':
    case 'completed':
    case 'paid':
      return 'completed';
    case 'pending':
    case 'processing':
    case 'requires_action':
    case 'requires_payment_method':
      return 'pending';
    case 'failed':
    case 'canceled':
    case 'cancelled':
    case 'requires_capture':
      return 'failed';
    default:
      return 'pending';
  }
}