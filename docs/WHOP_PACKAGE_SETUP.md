# Whop Fixed Package Setup Guide

## ✅ What's Been Implemented

- ✅ 4 Fixed credit packages ($10, $25, $50, $100)
- ✅ Bonus credits for larger packages
- ✅ Whop checkout integration
- ✅ Package-based frontend UI
- ✅ Automatic webhook processing

## 📋 Setup Steps

### Step 1: Create Products in Whop Dashboard

You need to create 4 products/plans in your Whop dashboard:

1. **Go to Whop Dashboard**
   - Visit: https://whop.com/dashboard
   - Navigate to Products or Plans section

2. **Create $10 Credit Package**
   - Name: "$10 Store Credits"
   - Price: $10.00
   - Type: One-time payment
   - Description: "Get $10 in store credits"
   - Copy the **Plan ID** (e.g., `plan_abc123xyz`)

3. **Create $25 Credit Package**
   - Name: "$25 Store Credits"
   - Price: $25.00
   - Type: One-time payment
   - Description: "Get $25 in store credits"
   - Copy the **Plan ID**

4. **Create $50 Credit Package**
   - Name: "$50 Store Credits"
   - Price: $50.00
   - Type: One-time payment
   - Description: "Get $50 + $5 bonus = $55 in store credits"
   - Copy the **Plan ID**

5. **Create $100 Credit Package**
   - Name: "$100 Store Credits"
   - Price: $100.00
   - Type: One-time payment
   - Description: "Get $100 + $20 bonus = $120 in store credits"
   - Copy the **Plan ID**

### Step 2: Update Plan IDs in Code

Open `src/lib/credits.ts` and replace the placeholder plan IDs with your actual Whop plan IDs:

```typescript
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_10",
    name: "$10 Credits",
    amount: 1000,
    price: 1000,
    description: "Perfect for getting started",
    whopPlanId: "plan_YOUR_10_DOLLAR_PLAN_ID_HERE", // ← Replace this
    enabled: true,
  },
  {
    id: "pkg_25",
    name: "$25 Credits",
    amount: 2500,
    price: 2500,
    description: "Popular choice for regular shoppers",
    whopPlanId: "plan_YOUR_25_DOLLAR_PLAN_ID_HERE", // ← Replace this
    popular: true,
    enabled: true,
  },
  {
    id: "pkg_50",
    name: "$50 Credits",
    amount: 5000,
    price: 5000,
    bonus: 500, // $5 bonus
    description: "Great value - get 10% bonus!",
    whopPlanId: "plan_YOUR_50_DOLLAR_PLAN_ID_HERE", // ← Replace this
    enabled: true,
  },
  {
    id: "pkg_100",
    name: "$100 Credits",
    amount: 10000,
    price: 10000,
    bonus: 2000, // $20 bonus
    description: "Best value - get 20% bonus!",
    whopPlanId: "plan_YOUR_100_DOLLAR_PLAN_ID_HERE", // ← Replace this
    enabled: true,
  },
];
```

### Step 3: Set Up Webhook

#### Using ngrok for Local Testing:

1. **Add ngrok auth token** (you already have this):
   ```bash
   ngrok config add-authtoken 33nIVALYfHIFhPFKZqPEgwBn8ex_76trfL5PKYDUNG4dTPmTy
   ```

2. **Start your dev server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok** (in another terminal):
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure Whop Webhook**:
   - Go to Whop Dashboard → Webhooks
   - Click "Add Webhook"
   - URL: `https://your-ngrok-url.ngrok.io/api/webhooks/whop`
   - Events: Select `payment.succeeded`
   - Save

### Step 4: Test the Flow

1. **Visit your credits page**:
   ```
   http://localhost:3000/credits
   ```

2. **You should see 4 packages**:
   - $10 Credits
   - $25 Credits (marked "Most Popular")
   - $50 Credits (with $5 bonus)
   - $100 Credits (with $20 bonus)

3. **Click "Purchase" on any package**:
   - Should redirect to Whop checkout
   - Complete payment with test card
   - Whop redirects back to success page
   - Credits automatically added via webhook

### Step 5: Verify Credits Added

After successful payment:

1. **Check your balance** in the header
2. **View transaction history** at `/account/transactions`
3. **Try purchasing a product** with your credits

## 🎨 Customizing Packages

### Change Bonus Amounts

Edit `src/lib/credits.ts`:

```typescript
{
  id: "pkg_50",
  amount: 5000,      // Base credits
  bonus: 1000,       // ← Change bonus (1000 = $10)
  // ...
}
```

### Add More Packages

Add new packages to the array:

```typescript
{
  id: "pkg_200",
  name: "$200 Credits",
  amount: 20000,
  price: 20000,
  bonus: 5000, // $50 bonus (25%)
  description: "Maximum value - get 25% bonus!",
  whopPlanId: "plan_YOUR_200_DOLLAR_PLAN_ID",
  enabled: true,
}
```

### Disable a Package

Set `enabled: false`:

```typescript
{
  id: "pkg_10",
  // ...
  enabled: false, // ← Package won't show on frontend
}
```

### Change Which is "Popular"

Move the `popular: true` flag:

```typescript
{
  id: "pkg_50",
  // ...
  popular: true, // ← This gets the "Most Popular" badge
}
```

## 🔧 Troubleshooting

### "Whop plan not configured" Error

**Cause:** Plan IDs still contain `REPLACE_WITH`

**Solution:** Replace all placeholder plan IDs with your actual Whop plan IDs from the dashboard

### Credits Not Added After Payment

**Check:**
1. ✅ Webhook configured in Whop dashboard
2. ✅ ngrok is running
3. ✅ Webhook URL matches ngrok URL
4. ✅ `WHOP_WEBHOOK_SECRET` in `.env.local`
5. ✅ Server restarted after ENV changes

**View logs:**
- Check terminal running `npm run dev`
- Look for: "Whop webhook received: payment.succeeded"
- Look for: "Credits added successfully"

### Not Redirecting to Whop Checkout

**Check:**
1. ✅ Plan IDs are correct
2. ✅ Plan IDs don't contain `REPLACE_WITH`
3. ✅ Whop API key is correct
4. ✅ Server restarted

**View error:**
- Check browser console (F12)
- Check server logs

### ngrok Closes Immediately

**Solution:** See `NGROK_SETUP.txt` in project root

Run:
```bash
ngrok config add-authtoken 33nIVALYfHIFhPFKZqPEgwBn8ex_76trfL5PKYDUNG4dTPmTy
ngrok http 3000
```

## 📊 Package Comparison

| Package | Price | Credits | Bonus | Total | Bonus % |
|---------|-------|---------|-------|-------|---------|
| $10 | $10.00 | $10.00 | $0.00 | $10.00 | 0% |
| $25 | $25.00 | $25.00 | $0.00 | $25.00 | 0% |
| $50 | $50.00 | $50.00 | $5.00 | $55.00 | 10% |
| $100 | $100.00 | $100.00 | $20.00 | $120.00 | 20% |

## 🚀 Production Deployment

When deploying to production:

### 1. Update Webhook URL

Change from ngrok to your production domain:
- Old: `https://abc123.ngrok.io/api/webhooks/whop`
- New: `https://yourdomain.com/api/webhooks/whop`

### 2. Use Production Whop Keys

In `.env.local` or production environment:
```bash
WHOP_API_KEY=live_key_here  # Not test key
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxx
WHOP_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. Switch Whop to Live Mode

In Whop dashboard:
- Toggle from "Test Mode" to "Live Mode"
- Use live plan IDs (not test plan IDs)

### 4. Test with Real Payment

Make a small real purchase to verify:
- Checkout works
- Webhook delivers
- Credits add correctly

## ✨ What's Working Now

- ✅ Professional package UI
- ✅ "Most Popular" badge on $25 package
- ✅ Bonus credits displayed for $50 & $100
- ✅ Total credits calculation (base + bonus)
- ✅ Whop checkout integration
- ✅ Automatic webhook processing
- ✅ Balance updates after purchase
- ✅ Transaction history tracking

## 🎯 Next Steps

1. **Create 4 products in Whop dashboard**
2. **Copy the 4 plan IDs**
3. **Update `src/lib/credits.ts` with plan IDs**
4. **Set up webhook with ngrok**
5. **Test purchase flow**

Once plan IDs are configured, the system is production-ready!

---

**Need Help?**
- Check `docs/TROUBLESHOOTING.md`
- Check server logs
- Check Whop webhook delivery logs in dashboard

