# Whop Plan ID - Complete Deep Dive Guide

## Understanding Whop's Product Structure

Whop has a hierarchical structure for selling products:

```
Business (Company)
  └── Product (prod_xxxxx)
      └── Plan (plan_xxxxx)  ← This is what we need!
          └── Price: $100
          └── Type: One-time or Subscription
```

**Important**:
- A **Product** is the container (e.g., "Store Credits")
- A **Plan** is the pricing option inside that product (e.g., "$100 one-time payment")
- You need the **Plan ID**, not the Product ID!

---

## Method 1: Find Plan ID in Dashboard (Recommended)

### Step-by-Step with Screenshots Reference:

#### 1. Access Whop Dashboard
- Go to: **https://dash.whop.com**
- Or: **https://whop.com/dashboard**

#### 2. Navigate to Your Company/Business
- On the home page, you'll see your business/company
- Click on your business name to enter the dashboard

#### 3. Go to Products Section
- Look in the left sidebar for:
  - "Products" OR
  - "Store" OR
  - "Manage Products"
- Click on it

#### 4. Find Your Product
- You should see a list of products you've created
- Look for "$100 Store Credits" (or whatever you named it)
- **Note the Product ID** (starts with `prod_`) - this is NOT what we need, but good to identify

#### 5. Click Into the Product
- Click on the product card or name
- This opens the product detail page

#### 6. Locate the Plans/Pricing Section
Look for one of these sections (names vary based on Whop version):
- "Plans"
- "Pricing"
- "Price Points"
- "Experiences and Plans"

**This section shows all the pricing options for this product.**

#### 7. Identify the Plan
You should see something like:

```
Plan Name: One-time Purchase
Price: $100.00
Type: One-time payment
Plan ID: plan_abc123xyz  ← THIS IS WHAT WE NEED!
```

#### 8. Copy the Plan ID
- Look for the Plan ID that starts with `plan_`
- There might be a copy icon 📋 next to it
- Or select the text and copy it manually

---

## Method 2: Use Whop API to List Plans

If you can't find the plan ID in the dashboard, you can use the Whop API directly:

### Using cURL:

```bash
curl https://api.whop.com/api/v5/plans \
  -H "Authorization: Bearer YOUR_WHOP_API_KEY"
```

Replace `YOUR_WHOP_API_KEY` with your actual API key from `.env.local`.

### Using Node.js Script:

Create a file called `list-whop-plans.js`:

```javascript
const fetch = require('node-fetch');

const WHOP_API_KEY = 'YOUR_WHOP_API_KEY'; // From your .env.local

async function listPlans() {
  try {
    const response = await fetch('https://api.whop.com/api/v5/plans', {
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Plans:', JSON.stringify(data, null, 2));

    // Extract plan IDs
    if (data.data) {
      console.log('\n=== PLAN IDs ===');
      data.data.forEach(plan => {
        console.log(`Plan ID: ${plan.id}`);
        console.log(`Name: ${plan.name}`);
        console.log(`Price: $${plan.amount / 100}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listPlans();
```

Run it:
```bash
node list-whop-plans.js
```

### Using Postman/Thunder Client:

**Request:**
- Method: `GET`
- URL: `https://api.whop.com/api/v5/plans`
- Headers:
  - `Authorization`: `Bearer YOUR_WHOP_API_KEY`
  - `Content-Type`: `application/json`

**Response will look like:**
```json
{
  "data": [
    {
      "id": "plan_abc123xyz",
      "name": "One-time Purchase",
      "amount": 10000,  // Price in cents ($100.00)
      "product_id": "prod_dh2QndgU9J79o",
      "type": "one_time",
      "created_at": 1234567890
    }
  ]
}
```

Copy the `"id"` field - that's your Plan ID!

---

## Method 3: Create a New Plan (If None Exists)

If you have a Product but no Plans under it, you need to create a plan:

### Via Dashboard:

1. **Open your Product** (e.g., "$100 Store Credits")
2. **Look for "Add Plan"** or "Create Pricing" button
3. **Fill in the details:**
   - Name: "One-time Purchase" or "$100 Package"
   - Price: `100.00` (in dollars)
   - Currency: `USD`
   - Type: **One-time payment** (NOT subscription)
   - Stock: Unlimited
4. **Click Save/Create**
5. **Copy the generated Plan ID**

### Via API:

```bash
curl -X POST https://api.whop.com/api/v5/plans \
  -H "Authorization: Bearer YOUR_WHOP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_dh2QndgU9J79o",
    "name": "One-time Purchase",
    "amount": 10000,
    "currency": "usd",
    "type": "one_time"
  }'
```

The response will include the new `plan_id`.

---

## Method 4: Check Developer Settings

1. **Go to**: https://dash.whop.com/settings/developer
2. **Scroll down** to find product/plan information
3. **Look for Plan IDs** listed in the API section

---

## What Each ID Type Looks Like

| ID Type | Format | Example | What It Represents |
|---------|--------|---------|-------------------|
| **Product ID** | `prod_xxxxx` | `prod_dh2QndgU9J79o` | The product container ❌ Not for checkout |
| **Plan ID** | `plan_xxxxx` | `plan_abc123xyz` | The pricing plan ✅ USE THIS |
| **Price ID** | `price_xxxxx` | `price_def456ghi` | Alternative to Plan ID ✅ USE THIS |
| App ID | `app_xxxxx` | `app_Mlkn4TU2buBBcl` | Your Whop app ❌ Not for checkout |
| Business ID | `biz_xxxxx` | `biz_8TRx8aZ4C2CPzu` | Your company ❌ Not for checkout |

**Key Point**: You need either `plan_xxxxx` or `price_xxxxx` for checkout sessions!

---

## Testing Your Plan ID

Once you have your Plan ID, test it:

### Test Script (`test-plan-id.js`):

```javascript
const { WhopServerSdk } = require("@whop/api");

const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  appApiKey: process.env.WHOP_API_KEY,
});

async function testPlanId(planId) {
  try {
    console.log(`Testing Plan ID: ${planId}`);

    const session = await whopSdk.payments.createCheckoutSession({
      planId: planId,
      redirectUrl: 'http://localhost:3000/credits/purchase-complete',
      metadata: {
        test: 'true'
      }
    });

    console.log('✅ Success! Plan ID is valid');
    console.log('Session ID:', session.id);
    console.log('Checkout URL:', `https://whop.com/checkout/${session.id}`);

  } catch (error) {
    console.log('❌ Error: Plan ID is invalid or API configuration is wrong');
    console.error(error.message);
  }
}

// Test with your plan ID
testPlanId('plan_abc123xyz'); // Replace with your actual plan ID
```

Run it:
```bash
node test-plan-id.js
```

---

## Common Issues & Solutions

### Issue 1: "Product ID doesn't work"
**Problem**: You're using `prod_xxxxx` instead of `plan_xxxxx`

**Solution**:
- Product IDs don't work for checkout
- You need the Plan ID inside that product
- Go back to Method 1 and look for plans within the product

### Issue 2: "Can't find any plans"
**Problem**: Product exists but has no pricing plans

**Solution**:
- Create a new plan using Method 3
- Or use the Whop dashboard to add a pricing option to your product

### Issue 3: "API returns 404"
**Problem**: Plan doesn't exist or API key is wrong

**Solution**:
- Double-check your API key in `.env.local`
- Verify the plan ID starts with `plan_` or `price_`
- Use Method 2 to list all available plans

### Issue 4: "Multiple plans exist, which one do I use?"
**Problem**: One product can have multiple pricing plans

**Solution**:
- For $10 package: Use the plan with `amount: 1000` (cents)
- For $25 package: Use the plan with `amount: 2500`
- For $50 package: Use the plan with `amount: 5000`
- For $100 package: Use the plan with `amount: 10000`

---

## Updating Your Code

Once you have all 4 Plan IDs, update `src/lib/credits.ts`:

```typescript
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_10",
    name: "$10 Credits",
    amount: 1000,
    price: 1000,
    description: "Perfect for getting started",
    whopPlanId: "plan_YOUR_10_DOLLAR_PLAN_ID", // ← Replace
    enabled: true,
  },
  {
    id: "pkg_25",
    name: "$25 Credits",
    amount: 2500,
    price: 2500,
    description: "Popular choice for regular shoppers",
    whopPlanId: "plan_YOUR_25_DOLLAR_PLAN_ID", // ← Replace
    popular: true,
    enabled: true,
  },
  {
    id: "pkg_50",
    name: "$50 Credits",
    amount: 5000,
    price: 5000,
    bonus: 500,
    description: "Great value - get 10% bonus!",
    whopPlanId: "plan_YOUR_50_DOLLAR_PLAN_ID", // ← Replace
    enabled: true,
  },
  {
    id: "pkg_100",
    name: "$100 Credits",
    amount: 10000,
    price: 10000,
    bonus: 2000,
    description: "Best value - get 20% bonus!",
    whopPlanId: "plan_YOUR_100_DOLLAR_PLAN_ID", // ← Replace
    enabled: true,
  },
];
```

---

## Quick Reference

**What you need**: Plan ID starting with `plan_` or `price_`

**Where to find it**:
1. Dashboard → Products → [Your Product] → Plans section
2. API call to `GET https://api.whop.com/api/v5/plans`
3. Create new plan if none exists

**What NOT to use**:
- ❌ Product ID (`prod_xxxxx`)
- ❌ App ID (`app_xxxxx`)
- ❌ Business ID (`biz_xxxxx`)

**Test it**: Use the test script above to verify your plan ID works

---

## Still Need Help?

If you're still stuck:

1. **Take a screenshot** of your Whop dashboard product page
2. **Show me** what you see, and I'll point out where the plan ID is
3. **Contact Whop Support**: https://whop.com/support
4. **Check Whop Discord**: They have a community Discord for developers

Remember: Every Product must have at least one Plan to be purchasable!
