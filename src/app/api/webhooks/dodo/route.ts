import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";

export async function POST(request: Request) {
  // Check if webhook key is configured
  const webhookKey = process.env.DODO_WEBHOOK_KEY;
  if (!webhookKey) {
    console.warn("DODO_WEBHOOK_KEY not configured, accepting all webhook requests");
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
    // const payload = JSON.parse(rawBody);
    // TODO: process payload (e.g., update order/payment status in DB)
    return new Response(null, { status: 200 });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
}


