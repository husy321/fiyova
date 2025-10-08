# Whop Payment Integration Guide

This document provides step-by-step instructions for integrating Whop Payments into the Fiyova e-commerce platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Webhook Setup](#webhook-setup)
7. [Testing](#testing)
8. [Migration from Dodo Payments](#migration-from-dodo-payments)

## Prerequisites

Before starting the integration, ensure you have:

- A Whop account ([create one here](https://whop.com))
- Node.js 18+ installed
- Next.js 15 project (already set up in Fiyova)
- Access to your Whop dashboard for API credentials

## Installation

Install the required Whop packages:

```bash
npm install @whop/api @whop-apps/iframe
```

For development proxy (optional):

```bash
npm install -D @whop-apps/dev-proxy
```

## Configuration

### 1. Get Your API Credentials

1. Log in to your [Whop Dashboard](https://whop.com/dashboard)
2. Navigate to **Developer Settings** or **App Settings**
3. Create a new app or select an existing one
4. Copy the following credentials:
   - **App ID** (from App Settings)
   - **API Key** (from API Keys section)
   - **Webhook Secret** (from Webhooks section)

### 2. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: For company-level operations
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id

# Whop Redirect URL (after payment completion)
WHOP_REDIRECT_URL=http://localhost:3000/checkout/complete
```

### 3. Update `.env.example`

Add the new environment variables to `.env.example` for documentation:

```bash
# Whop Payment Configuration
NEXT_PUBLIC_WHOP_APP_ID=
WHOP_API_KEY=
WHOP_WEBHOOK_SECRET=
WHOP_REDIRECT_URL=
```

## Backend Implementation

### 1. Create Whop SDK Client

Create a new file `src/lib/whop.ts`:

```typescript
import { WhopServerSdk } from "@whop/api";

if (!process.env.WHOP_API_KEY) {
  throw new Error("WHOP_API_KEY is not set in environment variables");
}

if (!process.env.NEXT_PUBLIC_WHOP_APP_ID) {
  throw new Error("NEXT_PUBLIC_WHOP_APP_ID is not set in environment variables");
}

export const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  appApiKey: process.env.WHOP_API_KEY,
});

// Optional: Create instance for user-specific operations
export const createUserWhopSdk = (userId: string) => {
  return WhopServerSdk({
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
    appApiKey: process.env.WHOP_API_KEY!,
    onBehalfOfUserId: userId,
  });
};
```

### 2. Create Product/Plan Management API

Create `src/app/api/whop/products/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { whopSdk } from "@/lib/whop";

export async function GET() {
  try {
    // Fetch products/plans from Whop
    const products = await whopSdk.products.listProducts();

    return NextResponse.json({
      success: true,
      products: products.data || [],
    });
  } catch (error) {
    console.error("Error fetching Whop products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

### 3. Create Checkout Session API

Create `src/app/api/whop/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { whopSdk } from "@/lib/whop";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, customerEmail, customerName, metadata } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "planId is required" },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await whopSdk.payments.createCheckoutSession({
      planId,
      redirectUrl: process.env.WHOP_REDIRECT_URL || "http://localhost:3000/checkout/complete",
      metadata: {
        customerEmail,
        customerName,
        ...metadata,
      },
    });

    // Construct checkout URL
    const checkoutUrl = `https://whop.com/checkout/${session.id}`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      sessionId: session.id,
      planId: session.planId,
    });
  } catch (error) {
    console.error("Error creating Whop checkout session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

### 4. Create In-App Purchase API (Alternative)

Create `src/app/api/whop/charge/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { whopSdk } from "@/lib/whop";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, userId, description, metadata } = body;

    if (!amount || !userId) {
      return NextResponse.json(
        { success: false, error: "amount and userId are required" },
        { status: 400 }
      );
    }

    // Create charge
    const charge = await whopSdk.payments.chargeUser({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || "USD",
      userId,
      metadata: {
        description,
        ...metadata,
      },
    });

    return NextResponse.json({
      success: true,
      charge,
    });
  } catch (error) {
    console.error("Error creating Whop charge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create charge" },
      { status: 500 }
    );
  }
}
```

## Frontend Implementation

### 1. Create Checkout Hook

Create `src/hooks/useWhopCheckout.ts`:

```typescript
"use client";

import { useState } from "react";

interface CheckoutData {
  planId: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
}

export function useWhopCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = async (data: CheckoutData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/whop/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create checkout");
      }

      // Redirect to Whop checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCheckout, loading, error };
}
```

### 2. Update Checkout Page

Update `src/app/checkout/page.tsx` to use Whop:

```typescript
"use client";

import { useState } from "react";
import { useWhopCheckout } from "@/hooks/useWhopCheckout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { createCheckout, loading, error } = useWhopCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCheckout({
        planId: "plan_xxxxx", // Replace with actual plan ID
        customerEmail: email,
        customerName: name,
        metadata: {
          source: "fiyova_checkout",
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Processing..." : "Continue to Payment"}
        </Button>
      </form>
    </div>
  );
}
```

### 3. Create Success Page

Update `src/app/checkout/complete/page.tsx`:

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCompletePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (sessionId) {
      // Verify the payment with your backend
      fetch(`/api/whop/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your payment...</h1>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h1>
        <p className="mb-6">There was an issue processing your payment.</p>
        <Button asChild>
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
      <p className="mb-2">Thank you for your purchase.</p>
      {orderId && <p className="mb-6 text-sm text-gray-600">Order ID: {orderId}</p>}
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
```

## Webhook Setup

### 1. Create Webhook Handler

Create `src/app/api/webhooks/whop/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { makeWebhookValidator } from "@whop/api";

const validateWebhook = makeWebhookValidator(
  process.env.WHOP_WEBHOOK_SECRET!
);

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

    // Handle different event types
    switch (event.type) {
      case "payment.succeeded":
        // Handle successful payment
        console.log("Payment succeeded:", event.data);
        // Update database, fulfill order, send confirmation email, etc.
        break;

      case "payment.failed":
        // Handle failed payment
        console.log("Payment failed:", event.data);
        break;

      case "subscription.created":
        // Handle new subscription
        console.log("Subscription created:", event.data);
        break;

      case "subscription.cancelled":
        // Handle subscription cancellation
        console.log("Subscription cancelled:", event.data);
        break;

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
```

### 2. Configure Webhook in Whop Dashboard

1. Go to your Whop Dashboard
2. Navigate to **Webhooks** section
3. Click **Add Webhook**
4. Enter your webhook URL: `https://yourdomain.com/api/webhooks/whop`
5. Select the events you want to receive:
   - `payment.succeeded`
   - `payment.failed`
   - `subscription.created`
   - `subscription.cancelled`
6. Copy the **Webhook Secret** and add it to your `.env.local`

## Testing

### 1. Test Mode

Ensure you're using test mode credentials during development:

```bash
# In Whop Dashboard, toggle to "Test Mode"
# Use test API keys in your .env.local
```

### 2. Test Cards

Use Whop's test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiration date and any 3-digit CVC.

### 3. Local Testing with ngrok

For webhook testing locally:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL in Whop webhook configuration
# Example: https://abc123.ngrok.io/api/webhooks/whop
```

## Migration from Dodo Payments

### Step-by-Step Migration

1. **Install Whop SDK** (already covered above)

2. **Keep Dodo Integration Running** (for existing orders)
   - Don't delete Dodo-related files immediately
   - Keep Dodo webhook handler active for legacy orders

3. **Update Product Mapping**
   - Create a mapping between Dodo products and Whop plans
   - Store in `src/lib/product-mapping.ts`:

```typescript
export const productMapping = {
  // Dodo Product ID -> Whop Plan ID
  "dodo_prod_123": "whop_plan_456",
  "dodo_prod_789": "whop_plan_012",
};
```

4. **Add Feature Flag**
   - Add to `.env.local`:

```bash
USE_WHOP_PAYMENTS=true
```

5. **Update Checkout Logic**
   - Modify checkout to use Whop when flag is enabled
   - Fall back to Dodo if needed

6. **Test Thoroughly**
   - Test complete checkout flow
   - Verify webhook handling
   - Check order fulfillment

7. **Deploy Gradually**
   - Deploy to staging first
   - Test with real payments in test mode
   - Monitor for issues
   - Deploy to production

8. **Cleanup**
   - After confirming Whop works well, remove Dodo code
   - Archive Dodo-related files for reference

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Logging**: Log all payment events for debugging
3. **Security**: Never expose API keys in client-side code
4. **Validation**: Validate all webhook signatures
5. **Idempotency**: Handle duplicate webhook events gracefully
6. **Testing**: Test with various payment scenarios
7. **Monitoring**: Set up alerts for payment failures

## Troubleshooting

### Common Issues

**Issue**: "Invalid API Key"
- **Solution**: Verify API key is correct and not expired
- Check you're using the right environment (test vs live)

**Issue**: "Plan not found"
- **Solution**: Ensure the plan ID exists in your Whop dashboard
- Verify you're using the correct plan ID format

**Issue**: "Webhook signature validation failed"
- **Solution**: Check webhook secret matches your dashboard
- Ensure you're passing the raw request body

**Issue**: "Redirect not working"
- **Solution**: Verify WHOP_REDIRECT_URL is set correctly
- Check the URL is whitelisted in Whop dashboard

## Support

- **Whop Documentation**: https://docs.whop.com
- **API Reference**: https://docs.whop.com/api-reference
- **Discord**: Join Whop's developer community
- **Email**: support@whop.com

## Next Steps

1. Set up your Whop account and get credentials
2. Install required packages
3. Implement backend API routes
4. Update frontend checkout flow
5. Set up webhooks
6. Test thoroughly in test mode
7. Deploy to production

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
