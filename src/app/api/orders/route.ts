import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { resolvePaymentDetails } from "@/lib/dodo-payment-details";
import { OrderService } from "@/lib/orders";
import type { Order } from "@/types";

interface DodoPaymentListItem {
  payment_id: string;
  total_amount: number;
  status?: string | null;
  created_at: string;
  currency: string;
  customer: {
    email: string;
  };
  product_cart?: Array<{
    product_id?: string | null;
  }> | null;
}

function hasIncompleteOrder(order: Order) {
  const missingName = !order.product_name || order.product_name === "Payment" || order.product_name === "Digital Product";
  const missingDownload = order.status === "completed" && !order.download_url;
  return missingName || missingDownload;
}

function mapPaymentStatus(dodoStatus: string): "completed" | "pending" | "failed" {
  switch (dodoStatus.toLowerCase()) {
    case "succeeded":
    case "completed":
    case "paid":
      return "completed";
    case "pending":
    case "processing":
    case "requires_action":
    case "requires_payment_method":
      return "pending";
    case "failed":
    case "canceled":
    case "cancelled":
    case "requires_capture":
      return "failed";
    default:
      return "pending";
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("customer_email");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const forceRefresh = searchParams.get("refresh") === "true";

    if (!userEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
    }

    const cachedResult = OrderService.getOrdersByEmail(userEmail, limit, page);
    const cacheLooksUsable =
      cachedResult.orders.length > 0 && cachedResult.orders.every((order) => !hasIncompleteOrder(order));

    if (!forceRefresh && cacheLooksUsable) {
      return NextResponse.json({
        orders: cachedResult.orders,
        total: cachedResult.total,
        page,
        limit,
        source: "cache",
      });
    }

    try {
      const client = getDodoClient();
      const paymentsResponse = await client.payments.list({
        page_size: limit,
        page_number: page,
      });

      const matchingPayments = ((paymentsResponse?.items ?? []) as DodoPaymentListItem[]).filter(
        (payment) => payment.customer.email.toLowerCase() === userEmail.toLowerCase(),
      );

      const orders = await Promise.all(
        matchingPayments.map(async (payment) => {
          const details = await resolvePaymentDetails(payment);

          const order: Order = {
            id: payment.payment_id,
            product_name: details.productName,
            amount: payment.total_amount,
            status: mapPaymentStatus(payment.status || "pending"),
            date: payment.created_at,
            customer_email: payment.customer.email,
            payment_id: payment.payment_id,
            currency: payment.currency,
            items: details.items,
            download_url: details.downloadUrl,
          };

          OrderService.createOrUpdateOrder(order);
          return order;
        }),
      );

      return NextResponse.json({
        orders,
        total: orders.length,
        page,
        limit,
        source: "dodo_sdk",
      });
    } catch (error) {
      console.error("Orders fetch failed, falling back to cache:", error);

      if (cachedResult.orders.length > 0) {
        return NextResponse.json({
          orders: cachedResult.orders,
          total: cachedResult.total,
          page,
          limit,
          source: "cache_fallback",
        });
      }

      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
