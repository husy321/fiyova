import { NextRequest, NextResponse } from "next/server";
import { makeWebhookValidator } from "@whop/api";
import { addCredits } from "@/lib/credits";

if (!process.env.WHOP_WEBHOOK_SECRET) {
  throw new Error("WHOP_WEBHOOK_SECRET is not set in environment variables");
}

const validateWebhook = makeWebhookValidator(process.env.WHOP_WEBHOOK_SECRET);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-whop-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Validate webhook signature
    const event = validateWebhook(body, signature);

    console.log("Whop webhook received:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment.succeeded": {
        const payment = event.data;
        const metadata = payment.metadata;

        // Check if this is a credit purchase
        if (metadata?.type === "credit_purchase") {
          const userId = metadata.userId;
          const packageId = metadata.packageId;
          const totalCredits = metadata.totalCredits;

          if (!userId || !totalCredits) {
            console.error("Missing required metadata for credit purchase");
            break;
          }

          // Add credits to user account
          const transaction = addCredits(
            userId,
            totalCredits,
            `Credit purchase: ${metadata.userName || "Unknown"} purchased ${packageId}`,
            {
              whopSessionId: payment.session_id || payment.id,
              whopPaymentId: payment.id,
              packageId,
              creditAmount: metadata.creditAmount,
              bonusAmount: metadata.bonusAmount || 0,
              userEmail: metadata.userEmail,
              userName: metadata.userName,
            }
          );

          console.log("Credits added successfully:", {
            userId,
            transactionId: transaction.id,
            amount: totalCredits,
          });
        }

        break;
      }

      case "payment.failed": {
        console.log("Payment failed:", event.data);
        // Handle failed payment (send email notification, etc.)
        break;
      }

      case "subscription.created": {
        console.log("Subscription created:", event.data);
        // Handle subscription if you add recurring credit purchases
        break;
      }

      case "subscription.cancelled": {
        console.log("Subscription cancelled:", event.data);
        // Handle subscription cancellation
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook validation failed" },
      { status: 400 }
    );
  }
}
