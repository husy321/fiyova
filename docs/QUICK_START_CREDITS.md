# Store Credits System - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install @whop/api
```

### Step 2: Set Up Whop Account

1. Go to [Whop.com](https://whop.com) and create an account
2. Create a new app in the Whop dashboard
3. Get your credentials:
   - **App ID** (from App Settings)
   - **API Key** (from API Keys section)
   - **Webhook Secret** (from Webhooks section)

### Step 3: Configure Environment Variables

Create or update `.env.local`:

```bash
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here

# Already exists, just verify
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 4: Create Whop Plans

In your Whop dashboard, create 4 products/plans:

1. **Starter Pack** - $10.00
2. **Popular Pack** - $25.00
3. **Value Pack** - $50.00
4. **Premium Pack** - $100.00

Copy each plan ID.

### Step 5: Update Credit Packages

Edit `src/lib/credits.ts` and replace the `whopPlanId` values:

```typescript
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_starter",
    name: "Starter Pack",
    amount: 1000,
    price: 1000,
    whopPlanId: "plan_xxxxxxxxx", // ← Replace with your Starter plan ID
    enabled: true,
  },
  {
    id: "pkg_popular",
    name: "Popular Pack",
    amount: 2500,
    price: 2500,
    bonus: 500,
    whopPlanId: "plan_xxxxxxxxx", // ← Replace with your Popular plan ID
    popular: true,
    enabled: true,
  },
  {
    id: "pkg_value",
    name: "Value Pack",
    amount: 5000,
    price: 5000,
    bonus: 1500,
    whopPlanId: "plan_xxxxxxxxx", // ← Replace with your Value plan ID
    enabled: true,
  },
  {
    id: "pkg_premium",
    name: "Premium Pack",
    amount: 10000,
    price: 10000,
    bonus: 3500,
    whopPlanId: "plan_xxxxxxxxx", // ← Replace with your Premium plan ID
    enabled: true,
  },
];
```

### Step 6: Create Data Directory

```bash
mkdir data
```

### Step 7: Set Up Webhook (Local Testing)

For local development, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose your local server
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

In Whop dashboard:
1. Go to **Webhooks**
2. Click **Add Webhook**
3. URL: `https://abc123.ngrok.io/api/webhooks/whop`
4. Select: `payment.succeeded` and `payment.failed`
5. Save

### Step 8: Test It Out!

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Log in or sign up at `http://localhost:3000/login`

3. Go to `http://localhost:3000/credits`

4. Click "Purchase" on any package

5. Use test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

6. Complete payment

7. You'll be redirected back and credits will be added!

8. Check your balance in the header

9. Try buying a product with your credits

## ✅ What You've Built

- ✅ Complete credit purchasing system
- ✅ Whop payment integration
- ✅ Automatic credit loading via webhooks
- ✅ Product purchases with credits
- ✅ Transaction history tracking
- ✅ Balance display in header
- ✅ Full transparency to Whop

## 📚 Next Steps

1. **Customize packages** - Edit amounts, prices, and bonuses in `src/lib/credits.ts`
2. **Add to product pages** - Use `ProductBuyWithCredits` component
3. **Style credit pages** - Customize UI in `/credits` pages
4. **Production setup** - Follow production checklist in main documentation

## 🔗 Key URLs

- **Buy Credits**: `/credits`
- **Transaction History**: `/account/transactions`
- **Success Page**: `/credits/purchase-complete`

## 📖 Full Documentation

See `docs/STORE_CREDITS_IMPLEMENTATION.md` for complete details on:
- API reference
- Component usage
- Security considerations
- Production deployment
- Troubleshooting

## 🆘 Common Issues

**Credits not added after payment?**
- Check Whop webhook logs in dashboard
- Verify webhook URL is accessible (ngrok running?)
- Check your server logs for errors

**Can't see credit balance?**
- Make sure you're logged in
- Check localStorage has user data
- Refresh the page

**Webhook signature validation failed?**
- Verify `WHOP_WEBHOOK_SECRET` matches Whop dashboard
- Make sure you're using raw request body in webhook handler

## 💡 Tips

- Use Whop's **Test Mode** during development
- Keep ngrok running while testing webhooks
- Check both Whop and your server logs for debugging
- Test the complete flow: purchase → webhook → balance → product purchase

---

**Need Help?** Check the full documentation in `docs/STORE_CREDITS_IMPLEMENTATION.md`
