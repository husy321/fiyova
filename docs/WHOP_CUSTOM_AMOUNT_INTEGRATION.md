# Whop Payment Integration for Custom Amounts

## Current Status

✅ **Development Mode Active** - Credits are added directly for testing
⚠️ **Production Integration Needed** - Real payment processing required

## The Challenge

Whop's standard checkout flow uses **fixed-price plans**. For custom amounts, you have **3 options**:

### Option 1: Whop Payment Links (Recommended)

Create payment links on-the-fly with custom amounts.

```typescript
// src/app/api/credits/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, userId, userEmail, userName } = await req.json();
  const amountInCents = Math.round(parseFloat(amount) * 100);

  // Generate unique payment link
  const paymentResponse = await fetch('https://api.whop.com/v5/payment-links', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHOP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountInCents,
      currency: 'USD',
      description: `Store Credits: $${(amountInCents / 100).toFixed(2)}`,
      metadata: {
        type: 'credit_purchase',
        userId,
        userEmail,
        userName,
        totalCredits: amountInCents
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/purchase-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits`
    })
  });

  const paymentData = await paymentResponse.json();

  return NextResponse.json({
    success: true,
    paymentUrl: paymentData.url,
    sessionId: paymentData.id
  });
}
```

**Frontend Update:**
```typescript
// src/app/credits/page.tsx
const result = await purchaseCredits(parseFloat(amount), userId, userEmail, userName);

if (result.paymentUrl) {
  // Redirect to Whop payment page
  window.location.href = result.paymentUrl;
}
```

### Option 2: Stripe Integration (Alternative)

If Whop doesn't support custom amounts well, use Stripe:

**Installation:**
```bash
npm install stripe
```

**Setup:**
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});
```

**API Route:**
```typescript
// src/app/api/credits/purchase/route.ts
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { amount, userId, userEmail, userName } = await req.json();
  const amountInCents = Math.round(parseFloat(amount) * 100);

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: amountInCents,
        product_data: {
          name: 'Store Credits',
          description: `$${(amountInCents / 100).toFixed(2)} in credits`,
        },
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/purchase-complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits`,
    metadata: {
      type: 'credit_purchase',
      userId,
      userEmail,
      userName,
      totalCredits: amountInCents.toString()
    }
  });

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    checkoutUrl: session.url
  });
}
```

**Webhook Handler:**
```typescript
// src/app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    if (metadata?.type === 'credit_purchase') {
      addCredits(
        metadata.userId,
        parseInt(metadata.totalCredits),
        `Credit purchase: $${(parseInt(metadata.totalCredits) / 100).toFixed(2)}`,
        {
          stripeSessionId: session.id,
          ...metadata
        }
      );
    }
  }

  return NextResponse.json({ received: true });
}
```

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Option 3: Manual Payment Processing

For development/testing or if you handle payments offline:

**Current Implementation** (already in place):
- Credits added directly without payment
- Useful for testing the credit system
- Manual payment tracking outside the system

**For Production:**
1. Collect payment externally (bank transfer, crypto, etc.)
2. Manually trigger credit addition via admin panel
3. Keep records for accounting

## Recommended Approach

**For Your Use Case:**

Since Whop is your chosen processor and you want custom amounts, I recommend:

1. **Check Whop's API** for dynamic payment link generation
2. **If Whop supports it**: Use Option 1 (Whop Payment Links)
3. **If Whop doesn't support it**: Use Option 2 (Stripe) as it's more flexible
4. **For Now**: Current development mode works for testing

## Implementation Steps

### Step 1: Choose Payment Processor

**Whop Advantages:**
- Already integrated
- Familiar with system
- May have existing account

**Stripe Advantages:**
- Very flexible with custom amounts
- Excellent documentation
- Easy integration
- Better for variable pricing

### Step 2: Update API Route

Replace the development code in `src/app/api/credits/purchase/route.ts` with your chosen integration (see examples above).

### Step 3: Update Frontend

Modify `src/app/credits/page.tsx` to handle redirect to payment page:

```typescript
const handlePurchase = async () => {
  if (!userId) {
    alert("Please log in to purchase credits");
    return;
  }

  if (!amount || !validateAmount(amount)) {
    return;
  }

  try {
    const result = await purchaseCredits(parseFloat(amount), userId, userEmail, userName);

    if (result.success) {
      // Redirect to payment page (Whop or Stripe)
      if (result.checkoutUrl || result.paymentUrl) {
        window.location.href = result.checkoutUrl || result.paymentUrl;
      } else {
        // Development mode - credits added directly
        alert(`Successfully added $${amount} in credits!`);
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("Purchase error:", error);
  }
};
```

### Step 4: Set Up Webhooks

**Whop:**
- Configure at: Whop Dashboard → Webhooks
- Endpoint: `https://yourdomain.com/api/webhooks/whop`
- Events: `payment.succeeded`

**Stripe:**
- Configure at: Stripe Dashboard → Webhooks
- Endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`

### Step 5: Test Thoroughly

1. Test with minimum amount ($1.00)
2. Test with maximum amount ($10,000.00)
3. Test with decimal amounts ($25.50)
4. Test webhook delivery
5. Verify credits added correctly
6. Check transaction history

## Testing Current Development Mode

The system works right now in development mode:

```bash
npm run dev
```

Visit `http://localhost:3000/credits`:
1. Enter any amount (e.g., $50)
2. Click "Purchase Credits"
3. Credits will be added immediately
4. Check balance in header
5. View transaction in `/account/transactions`

**Note:** No actual payment is processed in development mode.

## Production Checklist

Before going live:

- [ ] Choose payment processor (Whop or Stripe)
- [ ] Implement payment integration
- [ ] Set up webhook endpoints
- [ ] Configure webhook secrets
- [ ] Test with real payment (test mode)
- [ ] Verify webhook delivery
- [ ] Test refund flow
- [ ] Set up monitoring/alerts
- [ ] Update environment variables
- [ ] Test with various amounts
- [ ] Document payment flow

## Support Resources

**Whop:**
- API Docs: https://docs.whop.com
- Support: support@whop.com

**Stripe:**
- API Docs: https://stripe.com/docs/api
- Checkout Docs: https://stripe.com/docs/payments/checkout
- Support: https://support.stripe.com

## FAQ

**Q: Why not use Whop's fixed packages?**
A: User wanted flexibility for customers to choose exact amounts.

**Q: Can I use both Whop and Stripe?**
A: Yes, offer both as payment options to customers.

**Q: Is development mode secure?**
A: No, it bypasses payment. Only for testing. Never use in production.

**Q: How do I switch to production payment?**
A: Replace the code in `/api/credits/purchase/route.ts` with one of the integration examples above.

**Q: What if Whop doesn't support custom amounts?**
A: Use Stripe (Option 2) or create multiple fixed-price Whop plans for common amounts.

---

**Current Status**: Development Mode (No Real Payments)
**Next Step**: Choose and implement payment processor
**Recommended**: Stripe for custom amounts
**Alternative**: Whop if they support dynamic pricing

