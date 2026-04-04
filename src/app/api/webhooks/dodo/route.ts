import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { OrderService } from "@/lib/orders";
import { resolvePaymentDetails } from "@/lib/dodo-payment-details";
import type { Order } from "@/types";

interface WebhookPayment {
  id?: string;
  payment_id?: string;
  total_amount?: number;
  amount?: number;
  status?: string;
  created_at?: string;
  currency?: string;
  customer?: {
    email?: string;
  };
  customer_email?: string;
  product_cart?: Array<{
    product_id?: string | null;
  }> | null;
}

function mapWebhookStatus(type: string): Order["status"] {
  if (type === "payment.succeeded" || type === "payment.completed") return "completed";
  if (type === "payment.pending" || type === "payment.processing") return "pending";
  return "failed";
}

export async function POST(request: Request) {
  const webhookKey = process.env.DODO_WEBHOOK_KEY;

  if (!webhookKey) {
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

    if (
      payload.type !== "payment.succeeded" &&
      payload.type !== "payment.completed" &&
      payload.type !== "payment.pending" &&
      payload.type !== "payment.processing" &&
      payload.type !== "payment.failed" &&
      payload.type !== "payment.canceled"
    ) {
      return;
    }

    const payment = payload.data as WebhookPayment;
    const details = await resolvePaymentDetails(payment);

    const order: Order = {
      id: payment.payment_id || payment.id || "",
      payment_id: payment.payment_id || payment.id || "",
      product_name: details.productName,
      amount: payment.total_amount || payment.amount || 0,
      status: mapWebhookStatus(payload.type),
      date: payment.created_at || new Date().toISOString(),
      customer_email: payment.customer?.email || payment.customer_email || "",
      currency: payment.currency || "USD",
      items: details.items,
      download_url: details.downloadUrl,
    };

    OrderService.createOrUpdateOrder(order);
  } catch (error) {
    console.error("Error processing webhook:", error);
  }
}
