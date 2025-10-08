# How to Find Whop Plan ID

## Step-by-Step Guide

### Method 1: From Products Page

1. **Go to Whop Dashboard**
   - Visit: https://whop.com/dashboard
   - Or: https://dash.whop.com

2. **Navigate to Products**
   - Click on "Products" in the left sidebar
   - Or go to: https://dash.whop.com/products

3. **Click on Your Product**
   - Find the product you created (e.g., "$100 Store Credits")
   - Click on it to open product details

4. **Find the Plans/Prices Section**
   - Look for a section called "Plans", "Prices", or "Pricing"
   - This is usually in the middle of the product page

5. **Copy the Plan ID**
   - You should see one or more plans listed
   - Each plan will have an ID that starts with `plan_` or `price_`
   - Example: `plan_abc123xyz` or `price_def456ghi`
   - Click the copy icon next to it, or select and copy it

### Method 2: From API/Developer Section

1. **Go to Developer Settings**
   - Visit: https://dash.whop.com/settings/developer

2. **Look for API Keys section**
   - Scroll down to find your products/plans list

3. **Find Plan IDs**
   - Plan IDs should be listed alongside your products

### Method 3: Create a New Plan

If you don't see any plans, you may need to create a pricing plan:

1. **Open Your Product**
   - Go to Products → Click your product

2. **Add a Plan/Price**
   - Look for "Add Plan" or "Add Price" button
   - Set the price (e.g., $100.00)
   - Set it as "One-time payment" (not subscription)
   - Click "Save" or "Create"

3. **Copy the Generated Plan ID**
   - After creating, you'll see the plan ID
   - Copy it (starts with `plan_` or `price_`)

## What You're Looking For

✅ **Correct Format**:
- `plan_abc123xyz`
- `price_def456ghi`

❌ **Wrong Format** (Don't use these):
- `prod_abc123` (Product ID - not what we need)
- `app_abc123` (App ID - not what we need)
- `biz_abc123` (Business ID - not what we need)

## Still Can't Find It?

If you're having trouble:

1. **Check if you created the product as a "Plan" or "Experience"**
   - Whop has different product types
   - For credit purchases, you want "Plans" or "Passes"

2. **Take a screenshot**
   - Screenshot your product page
   - Show me what you see, and I can help identify where the plan ID is

3. **Use Whop Support**
   - Contact Whop support: https://whop.com/support
   - Ask: "Where do I find my Plan ID for API integration?"

## Once You Have the Plan ID

Replace it in `src/lib/credits.ts`:

```typescript
{
  id: "pkg_100",
  name: "$100 Credits",
  amount: 10000,
  price: 10000,
  bonus: 2000,
  description: "Best value - get 20% bonus!",
  whopPlanId: "plan_YOUR_ACTUAL_PLAN_ID_HERE", // ← Paste your plan ID here
  enabled: true,
}
```

Then restart your dev server:
```bash
npm run dev
```
