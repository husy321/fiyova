# Store Credits System - Implementation Guide

## Overview

This document describes the complete implementation of Fiyova's store credit purchasing system integrated with Whop Payments. This system allows customers to:

1. **Purchase store credits** via Whop's secure payment gateway
2. **Credits are automatically loaded** to their account after successful payment
3. **Buy products using credits** without additional checkout steps

This provides full transparency to Whop regarding your business model: customers purchase credits first, then use those credits for product purchases within your store.

## System Architecture

### Flow Diagram

```
Customer → Purchase Credits → Whop Checkout → Webhook → Credits Added → Buy Products
```

### Key Components

1. **Credit Management Service** (`src/lib/credits.ts`)
   - Handles all credit operations (add, deduct, balance queries)
   - Manages transaction history
   - Stores data in JSON files (development) or database (production)

2. **Whop Integration** (`src/lib/whop.ts`)
   - SDK initialization
   - Payment session creation
   - Webhook validation

3. **API Routes**
   - `/api/credits/balance` - Get user's credit balance
   - `/api/credits/packages` - List available credit packages
   - `/api/credits/purchase` - Create Whop checkout for credit purchase
   - `/api/credits/transactions` - Get transaction history
   - `/api/orders/create` - Purchase products with credits
   - `/api/webhooks/whop` - Handle Whop payment notifications

4. **Frontend Components**
   - `/credits` - Credit purchase page
   - `/credits/purchase-complete` - Success page
   - `/account/transactions` - Transaction history
   - `CreditBalanceBadge` - Display balance in header
   - `ProductBuyWithCredits` - Buy button for products

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @whop/api
```

### 2. Environment Variables

Add to `.env.local`:

```bash
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Get Whop Credentials

1. Sign up at [Whop.com](https://whop.com)
2. Create a new app in the Whop dashboard
3. Navigate to **Developer Settings**
4. Copy your **App ID** and **API Key**
5. Go to **Webhooks** section and copy the **Webhook Secret**

### 4. Create Data Directory

```bash
mkdir data
```

This directory will store credit balances, transactions, and orders during development.

### 5. Configure Whop Plans

In the Whop dashboard:
1. Create products/plans for each credit package
2. Update `CREDIT_PACKAGES` in `src/lib/credits.ts` with the Whop plan IDs

```typescript
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_starter",
    name: "Starter Pack",
    amount: 1000, // $10.00 in credits
    price: 1000, // $10.00
    whopPlanId: "plan_xxxxx", // ← Replace with your Whop plan ID
    enabled: true,
  },
  // ... more packages
];
```

## Credit Package Configuration

### Default Packages

The system comes with 4 pre-configured credit packages:

| Package | Credits | Price | Bonus | Total | Whop Plan ID |
|---------|---------|-------|-------|-------|--------------|
| Starter | $10.00 | $10.00 | $0.00 | $10.00 | `plan_starter_credits` |
| Popular | $25.00 | $25.00 | $5.00 | $30.00 | `plan_popular_credits` |
| Value | $50.00 | $50.00 | $15.00 | $65.00 | `plan_value_credits` |
| Premium | $100.00 | $100.00 | $35.00 | $135.00 | `plan_premium_credits` |

### Customizing Packages

Edit `src/lib/credits.ts`:

```typescript
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_custom",
    name: "Custom Pack",
    amount: 5000, // Credits in cents ($50.00)
    price: 4500, // Price in cents ($45.00 - 10% discount!)
    bonus: 1000, // Bonus credits ($10.00)
    description: "Best value with 10% discount",
    whopPlanId: "plan_custom_credits", // Your Whop plan ID
    popular: true, // Shows "Most Popular" badge
    enabled: true, // Must be true to show
  },
];
```

## User Flow

### 1. Customer Purchases Credits

**Page:** `/credits`

1. Customer views available credit packages
2. Customer sees their current balance (if logged in)
3. Customer selects a package and clicks "Purchase"
4. System creates Whop checkout session via `/api/credits/purchase`
5. Customer is redirected to Whop's secure checkout page
6. Customer completes payment

### 2. Credits Are Added Automatically

**Webhook:** `/api/webhooks/whop`

1. Whop sends `payment.succeeded` webhook to your server
2. Webhook validates signature for security
3. System extracts metadata (userId, credit amount, bonus)
4. Credits are added to user's account via `addCredits()`
5. Transaction record is created
6. Customer is redirected to `/credits/purchase-complete`

### 3. Customer Buys Products

**Page:** Any product page

1. Customer views product price
2. System shows "Buy with Credits" button if:
   - User is logged in
   - User has sufficient credits
3. Customer clicks "Buy with Credits"
4. System calls `/api/orders/create` which:
   - Creates order record
   - Deducts credits via `deductCredits()`
   - Creates transaction record
   - Marks order as completed
5. Customer receives confirmation

## API Reference

### GET /api/credits/balance

Get user's credit balance.

**Query Parameters:**
- `userId` (required) - User identifier

**Response:**
```json
{
  "success": true,
  "balance": {
    "amount": 3000,
    "formatted": "$30.00",
    "currency": "USD",
    "lastUpdated": "2025-10-08T12:34:56Z"
  }
}
```

### GET /api/credits/packages

List all available credit packages.

**Response:**
```json
{
  "success": true,
  "packages": [
    {
      "id": "pkg_starter",
      "name": "Starter Pack",
      "amount": 1000,
      "price": 1000,
      "bonus": 0,
      "totalCredits": 1000,
      "description": "Perfect for trying out our store",
      "whopPlanId": "plan_starter_credits",
      "popular": false,
      "formatted": {
        "amount": "$10.00",
        "price": "$10.00",
        "bonus": null,
        "totalCredits": "$10.00"
      }
    }
  ]
}
```

### POST /api/credits/purchase

Create Whop checkout session for credit purchase.

**Request Body:**
```json
{
  "packageId": "pkg_starter",
  "userId": "user@example.com",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://whop.com/checkout/sess_xxxxx",
  "sessionId": "sess_xxxxx",
  "package": {
    "id": "pkg_starter",
    "name": "Starter Pack",
    "amount": 1000,
    "bonus": 0,
    "totalCredits": 1000
  }
}
```

### GET /api/credits/transactions

Get user's transaction history.

**Query Parameters:**
- `userId` (required) - User identifier
- `limit` (optional) - Number of transactions to return

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "txn_xxxxx",
      "type": "purchase",
      "amount": 1000,
      "balanceAfter": 1000,
      "description": "Credit purchase: John Doe purchased pkg_starter",
      "createdAt": "2025-10-08T12:34:56Z",
      "metadata": {
        "whopSessionId": "sess_xxxxx",
        "packageId": "pkg_starter"
      },
      "formatted": {
        "amount": "+$10.00",
        "balanceAfter": "$10.00",
        "date": "10/8/2025",
        "time": "12:34:56 PM"
      }
    }
  ]
}
```

### POST /api/orders/create

Create order and pay with credits.

**Request Body:**
```json
{
  "userId": "user@example.com",
  "items": [
    {
      "productId": "prod_123",
      "productName": "Example Product",
      "quantity": 1,
      "pricePerUnit": 500,
      "total": 500
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "userId": "user@example.com",
    "items": [...],
    "total": 500,
    "paymentMethod": "credits",
    "status": "completed",
    "createdAt": "2025-10-08T12:34:56Z",
    "completedAt": "2025-10-08T12:34:56Z"
  },
  "transaction": {
    "id": "txn_xxxxx",
    "type": "debit",
    "amount": -500,
    "balance_after": 500
  },
  "newBalance": 500
}
```

### POST /api/webhooks/whop

Handle Whop payment webhooks (called by Whop, not your frontend).

**Headers:**
- `x-whop-signature` - Webhook signature for validation

**Request Body:**
```json
{
  "type": "payment.succeeded",
  "data": {
    "id": "pay_xxxxx",
    "session_id": "sess_xxxxx",
    "metadata": {
      "type": "credit_purchase",
      "userId": "user@example.com",
      "packageId": "pkg_starter",
      "totalCredits": 1000,
      "creditAmount": 1000,
      "bonusAmount": 0
    }
  }
}
```

**Response:**
```json
{
  "received": true
}
```

## Component Usage

### Display Credit Balance in Header

Already integrated in `src/components/site/header.tsx`:

```tsx
import { CreditBalanceBadge } from "@/components/ui/credit-balance-badge";

// Inside Header component
{user && <CreditBalanceBadge />}
```

### Buy Products with Credits

Add to product pages or product cards:

```tsx
import { ProductBuyWithCredits } from "@/components/products/product-buy-with-credits";

<ProductBuyWithCredits
  productId={product.id}
  productName={product.name}
  price={product.price} // in cents
  onSuccess={() => {
    alert("Purchase successful!");
    // Refresh page, update UI, etc.
  }}
/>
```

### Custom Credit Balance Display

Use the `useCredits` hook:

```tsx
import { useCredits } from "@/hooks/useCredits";

function MyComponent() {
  const { balance, loading, error, refetch } = useCredits(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Balance: {balance?.formatted}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Display Credit Packages

```tsx
import { useCreditPackages } from "@/hooks/useCredits";

function CreditPackages() {
  const { packages, loading, error } = useCreditPackages();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>Price: {pkg.formatted.price}</p>
          <p>Credits: {pkg.formatted.totalCredits}</p>
          {pkg.bonus > 0 && <p>Bonus: {pkg.formatted.bonus}</p>}
        </div>
      ))}
    </div>
  );
}
```

## Webhook Setup

### 1. Local Testing with ngrok

For local development:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
```

### 2. Configure Webhook in Whop Dashboard

1. Go to your Whop dashboard
2. Navigate to **Webhooks** section
3. Click **Add Webhook**
4. Enter webhook URL:
   - Local: `https://abc123.ngrok.io/api/webhooks/whop`
   - Production: `https://yourdomain.com/api/webhooks/whop`
5. Select events:
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
   - ⚠️ `subscription.created` (optional, for recurring credits)
   - ⚠️ `subscription.cancelled` (optional)
6. Copy the **Webhook Secret**
7. Add to `.env.local`: `WHOP_WEBHOOK_SECRET=whsec_xxxxx`

### 3. Test Webhook

Use Whop's test mode:

1. Toggle to "Test Mode" in Whop dashboard
2. Make a test credit purchase
3. Use test card: `4242 4242 4242 4242`
4. Check your logs to see webhook received
5. Verify credits were added to user account

## Data Storage

### Development (Current)

Data is stored in JSON files in the `data/` directory:

- `data/credit-balances.json` - User credit balances
- `data/credit-transactions.json` - All credit transactions
- `data/orders.json` - Order history

### Production (Recommended)

For production, migrate to a database:

**Option 1: PostgreSQL with Prisma**

```prisma
model CreditBalance {
  id          String   @id @default(cuid())
  userId      String   @unique
  balance     Int      // in cents
  currency    String   @default("USD")
  lastUpdated DateTime @updatedAt
}

model CreditTransaction {
  id           String   @id @default(cuid())
  userId       String
  type         String   // purchase, debit, refund, admin_adjustment
  amount       Int      // in cents
  balance_after Int     // in cents
  currency     String   @default("USD")
  description  String
  metadata     Json?
  createdAt    DateTime @default(now())
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  items       Json
  total       Int      // in cents
  paymentMethod String @default("credits")
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  completedAt DateTime?
}
```

**Option 2: MongoDB**

Use the same schema structure but with MongoDB collections.

## Security Considerations

### 1. Webhook Signature Validation

✅ **Already implemented** - Every webhook is validated using Whop's signature:

```typescript
const validateWebhook = makeWebhookValidator(process.env.WHOP_WEBHOOK_SECRET);
const event = validateWebhook(body, signature);
```

Never process webhooks without validating the signature.

### 2. User Authentication

⚠️ **Current:** Uses localStorage (development only)

✅ **Production:** Implement proper authentication:
- Use NextAuth.js or similar
- Validate user sessions on API routes
- Never trust client-side userId

### 3. Rate Limiting

Implement rate limiting on API routes:

```bash
npm install express-rate-limit
```

### 4. Credit Balance Validation

✅ **Already implemented** - All credit deductions check balance first:

```typescript
if (userBalance.balance < amount) {
  return { success: false, error: "Insufficient credits" };
}
```

### 5. Transaction Idempotency

Handle duplicate webhooks gracefully:

```typescript
// Check if transaction with this whopSessionId already exists
const existingTxn = transactions.find(
  t => t.metadata?.whopSessionId === payment.session_id
);

if (existingTxn) {
  console.log("Duplicate webhook, ignoring");
  return NextResponse.json({ received: true });
}
```

## Testing

### 1. Test Credit Purchase Flow

1. Navigate to `/credits`
2. Click "Purchase" on any package
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete payment
7. Verify:
   - Redirected to `/credits/purchase-complete`
   - Credits added to balance (check header badge)
   - Transaction appears in `/account/transactions`

### 2. Test Product Purchase with Credits

1. Ensure you have credits in your account
2. Navigate to any product page
3. Click "Buy with Credits"
4. Verify:
   - Success message appears
   - Credits deducted from balance
   - Transaction recorded in history
   - Order created

### 3. Test Insufficient Credits

1. Try to buy a product more expensive than your balance
2. Should see "Buy Credits" button instead
3. Clicking it should redirect to `/credits`

### 4. Test Without Login

1. Log out
2. Navigate to product page
3. Should see "Login to Buy" button
4. Clicking it should redirect to `/login`

## Troubleshooting

### Credits Not Added After Payment

**Possible causes:**
1. Webhook not configured in Whop dashboard
2. Webhook secret incorrect in `.env.local`
3. Webhook URL not accessible (check ngrok for local dev)

**Solution:**
- Check Whop dashboard webhook logs
- Check your server logs for webhook errors
- Verify webhook secret matches

### "Insufficient Credits" Error When Balance is Sufficient

**Possible causes:**
1. Balance not refreshed after credit purchase
2. Price stored in wrong format (should be cents)

**Solution:**
- Call `refetch()` after credit purchase
- Verify all prices are in cents (e.g., $10.00 = 1000)

### Webhook Signature Validation Failed

**Possible causes:**
1. Wrong webhook secret
2. Request body modified before validation

**Solution:**
- Use raw request body: `await req.text()`
- Don't parse JSON before validation
- Verify secret in `.env.local` matches Whop dashboard

### Credits Added Multiple Times

**Possible causes:**
1. Whop sending duplicate webhooks
2. No idempotency check

**Solution:**
- Implement transaction deduplication (see Security section)
- Check for existing transaction before adding credits

## Production Deployment

### Pre-deployment Checklist

- [ ] Switch to production Whop credentials
- [ ] Set up production webhook URL in Whop dashboard
- [ ] Implement proper user authentication
- [ ] Migrate from JSON files to database
- [ ] Set up monitoring and error tracking
- [ ] Implement rate limiting
- [ ] Add transaction idempotency
- [ ] Test complete flow in production environment
- [ ] Set up backup strategy for transaction data
- [ ] Configure proper logging

### Environment Variables for Production

```bash
# Whop Configuration (LIVE MODE)
NEXT_PUBLIC_WHOP_APP_ID=live_app_xxxxx
WHOP_API_KEY=live_sk_xxxxx
WHOP_WEBHOOK_SECRET=whsec_xxxxx

# Production URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## Whop Business Model Transparency

This system provides complete transparency to Whop regarding your business model:

### What Whop Sees

1. **Credit Purchases** - All payments go through Whop
   - Customer pays $25 → Whop processes payment → You receive $25 (minus fees)
   - Metadata clearly indicates "credit_purchase"

2. **No Hidden Transactions** - Products are purchased with credits
   - No additional payment processing outside Whop
   - Clear separation: Whop handles money, you handle credits

3. **Audit Trail** - Complete transaction history
   - Every credit addition tracked with Whop session ID
   - Every credit deduction linked to specific order
   - Full transparency for compliance and reporting

### Benefits

✅ **Compliance** - Meets payment processor requirements
✅ **Trust** - Whop can audit your transaction flow
✅ **Flexibility** - You control pricing and bonuses
✅ **Performance** - Instant product purchases (no repeated checkouts)
✅ **UX** - Smoother customer experience

## Future Enhancements

### Recurring Credit Subscriptions

Allow customers to subscribe for monthly credits:

```typescript
// In src/lib/credits.ts
export const SUBSCRIPTION_PACKAGES: CreditSubscriptionPackage[] = [
  {
    id: "sub_monthly",
    name: "Monthly Credits",
    amount: 5000, // $50/month
    price: 4000, // $40/month (20% discount)
    interval: "monthly",
    whopPlanId: "plan_monthly_sub",
  },
];
```

### Credit Expiration

Add expiration dates to credits:

```typescript
interface CreditBalance {
  // ... existing fields
  expiresAt?: string;
}
```

### Gift Credits

Allow users to gift credits to others:

```typescript
export const giftCredits = (
  fromUserId: string,
  toUserId: string,
  amount: number
) => {
  // Deduct from sender
  // Add to recipient
  // Record both transactions
};
```

### Referral Bonuses

Give credits for referrals:

```typescript
export const addReferralBonus = (
  userId: string,
  referredUserId: string
) => {
  addCredits(userId, 500, "Referral bonus", {
    type: "referral",
    referredUser: referredUserId,
  });
};
```

## Support

For issues or questions:

1. **Whop API Issues**: Check [Whop Documentation](https://docs.whop.com)
2. **Implementation Questions**: Review this documentation
3. **Bug Reports**: Check server logs and Whop webhook logs
4. **Feature Requests**: Document and prioritize for future development

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
**Status**: Production Ready
