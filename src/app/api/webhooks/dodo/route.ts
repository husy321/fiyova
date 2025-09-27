import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";

const webhook = new Webhook(process.env.DODO_WEBHOOK_KEY!);

export async function POST(request: Request) {
  const headersList = headers();
  const rawBody = await request.text();

  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  try {
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);
    // TODO: process payload (e.g., update order/payment status in DB)
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }
}


