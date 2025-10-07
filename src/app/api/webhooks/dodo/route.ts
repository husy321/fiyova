import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { OrderService } from "@/lib/orders";
import { Order } from "@/types";

export async function POST(request: Request) {
  // Check if webhook key is configured
  const webhookKey = process.env.DODO_WEBHOOK_KEY;
  if (!webhookKey) {
    console.warn("DODO_WEBHOOK_KEY not configured, accepting all webhook requests");
    // Still process the webhook even without verification in development
    const body = await request.text();
    await processWebhook(body);
    return new Response(null, { status: 200 });
  }

  const webhook = new Webhook(webhookKey);
  const headersList = await headers();
  const rawBody = await request.text();

  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  try {
    await webhook.verify(rawBody, webhookHeaders);
    await processWebhook(rawBody);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }
}

async function processWebhook(rawBody: string) {
  try {
    const payload = JSON.parse(rawBody);
    console.log("Processing webhook event:", payload.type);

    // Handle payment success events
    if (payload.type === "payment.succeeded" || payload.type === "payment.completed") {
      const payment = payload.data;

      // Extract product name from line items if available
      const productName = payment.line_items?.[0]?.name ||
                         payment.items?.[0]?.name ||
                         "Digital Product";

      // Extract download URL from line items if available
      const downloadUrl = payment.line_items?.[0]?.download_url ||
                         payment.items?.[0]?.download_url;

      const order: Order = {
        id: payment.payment_id || payment.id,
        payment_id: payment.payment_id || payment.id,
        product_name: productName,
        amount: payment.total_amount || payment.amount || 0,
        status: "completed",
        date: payment.created_at || new Date().toISOString(),
        customer_email: payment.customer?.email || payment.customer_email,
        currency: payment.currency || "USD",
        items: payment.line_items || payment.items || [],
        download_url: downloadUrl
      };

      // Save order to local cache
      OrderService.createOrUpdateOrder(order);
      console.log("Order cached successfully:", order.payment_id);
    }

    // Handle payment pending/processing events
    if (payload.type === "payment.pending" || payload.type === "payment.processing") {
      const payment = payload.data;

      const order: Order = {
        id: payment.payment_id || payment.id,
        payment_id: payment.payment_id || payment.id,
        product_name: payment.line_items?.[0]?.name || payment.items?.[0]?.name || "Digital Product",
        amount: payment.total_amount || payment.amount || 0,
        status: "pending",
        date: payment.created_at || new Date().toISOString(),
        customer_email: payment.customer?.email || payment.customer_email,
        currency: payment.currency || "USD",
        items: payment.line_items || payment.items || []
      };

      OrderService.createOrUpdateOrder(order);
      console.log("Order status updated to pending:", order.payment_id);
    }

    // Handle payment failed events
    if (payload.type === "payment.failed" || payload.type === "payment.canceled") {
      const payment = payload.data;

      const order: Order = {
        id: payment.payment_id || payment.id,
        payment_id: payment.payment_id || payment.id,
        product_name: payment.line_items?.[0]?.name || payment.items?.[0]?.name || "Digital Product",
        amount: payment.total_amount || payment.amount || 0,
        status: "failed",
        date: payment.created_at || new Date().toISOString(),
        customer_email: payment.customer?.email || payment.customer_email,
        currency: payment.currency || "USD",
        items: payment.line_items || payment.items || []
      };

      OrderService.createOrUpdateOrder(order);
      console.log("Order status updated to failed:", order.payment_id);
    }

  } catch (error) {
    console.error("Error processing webhook:", error);
    // Don't throw - we still want to return 200 to Dodo to prevent retries
  }
}


