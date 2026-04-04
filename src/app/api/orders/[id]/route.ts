import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { resolvePaymentDetails } from "@/lib/dodo-payment-details";
import { OrderService } from "@/lib/orders";
import type { Order } from "@/types";

function hasIncompleteOrder(order: Order) {
  const missingName = !order.product_name || order.product_name === "Payment" || order.product_name === "Digital Product";
  const missingDownload = order.status === "completed" && !order.download_url;
  return missingName || missingDownload;
}

function mapPaymentStatus(dodoStatus: string): Order["status"] {
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cachedOrder = OrderService.getOrderByPaymentId(id);

    if (cachedOrder && !hasIncompleteOrder(cachedOrder)) {
      return NextResponse.json(cachedOrder);
    }

    try {
      const client = getDodoClient();
      const payment = await client.payments.retrieve(id);
      const details = await resolvePaymentDetails(payment);

      const order: Order = {
        id: payment.payment_id,
        payment_id: payment.payment_id,
        product_name: details.productName,
        amount: payment.total_amount,
        status: mapPaymentStatus(payment.status || "pending"),
        date: payment.created_at,
        customer_email: payment.customer.email,
        currency: payment.currency,
        items: details.items,
        download_url: details.downloadUrl,
      };

      OrderService.createOrUpdateOrder(order);
      return NextResponse.json(order);
    } catch (error) {
      if (cachedOrder) {
        return NextResponse.json(cachedOrder);
      }

      console.error("Error fetching order from Dodo:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
