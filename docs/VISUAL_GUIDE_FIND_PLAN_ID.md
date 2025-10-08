# 🎯 Visual Guide: Finding Your Whop Plan ID

## The Problem

You have: `prod_dh2QndgU9J79o` ← This is a **Product ID** ❌
You need: `plan_abc123xyz` ← This is a **Plan ID** ✅

**Why?** The Whop checkout API requires a Plan ID, not a Product ID.

---

## Understanding the Structure

```
┌─────────────────────────────────────────┐
│  Whop Business                          │
│  biz_8TRx8aZ4C2CPzu                    │
│                                         │
│  ├── Product: "$100 Store Credits"     │
│  │   ID: prod_dh2QndgU9J79o           │ ← YOU ARE HERE
│  │                                     │
│  │   └── Plan: "One-time Purchase"    │
│  │       ID: plan_abc123xyz           │ ← YOU NEED THIS!
│  │       Price: $100.00                │
│  │       Type: One-time                │
│  │                                     │
│  ├── Product: "$50 Store Credits"      │
│  │   ID: prod_xyz789                  │
│  │   └── Plan: plan_def456            │
│  │                                     │
│  └── Product: "$25 Store Credits"      │
│      ID: prod_ghi012                  │
│      └── Plan: plan_ghi789            │
└─────────────────────────────────────────┘
```

---

## Step-by-Step Visual Guide

### Step 1: Open Whop Dashboard
```
🌐 Browser → https://dash.whop.com
```

You'll see something like:

```
┌──────────────────────────────────────────────┐
│  Whop Dashboard                         [⚙️]  │
├──────────────────────────────────────────────┤
│  Sidebar:                                    │
│  ☰ Menu                                      │
│    📊 Overview                                │
│    💰 Products          ← CLICK HERE         │
│    👥 Customers                               │
│    📈 Analytics                               │
│    🔧 Settings                                │
└──────────────────────────────────────────────┘
```

### Step 2: Click "Products"

You'll see a list of products:

```
┌──────────────────────────────────────────────┐
│  Products                         [+ New]     │
├──────────────────────────────────────────────┤
│                                              │
│  ╔════════════════════════════════════════╗ │
│  ║ "$100 Store Credits"            [Edit] ║ │ ← CLICK THIS CARD
│  ║ prod_dh2QndgU9J79o                     ║ │
│  ║ One-time payment • $100.00             ║ │
│  ╚════════════════════════════════════════╝ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ "$50 Store Credits"             [Edit] │ │
│  │ prod_xyz789                            │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Step 3: Inside the Product Page

After clicking, you'll see the product details:

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Products                                  │
├─────────────────────────────────────────────────────┤
│  Product Details                                     │
│                                                      │
│  Name: $100 Store Credits                           │
│  Description: Get $100 in store credits             │
│  Product ID: prod_dh2QndgU9J79o                     │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ PRICING / PLANS                   [+ Add Plan] │  │ ← LOOK HERE!
│  ├───────────────────────────────────────────────┤  │
│  │                                               │  │
│  │  ╔══════════════════════════════════════╗    │  │
│  │  ║ One-time Purchase                    ║    │  │
│  │  ║                                      ║    │  │
│  │  ║ Plan ID: plan_abc123xyz    [📋 Copy]║    │  │ ← COPY THIS!
│  │  ║ Price: $100.00                      ║    │  │
│  │  ║ Type: One-time payment              ║    │  │
│  │  ║ Status: Active                      ║    │  │
│  │  ╚══════════════════════════════════════╝    │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  [Save Changes]  [Delete Product]                   │
└─────────────────────────────────────────────────────┘
```

### Step 4: Copy the Plan ID

Look for text that says:
- "Plan ID: plan_xxxxx" or
- "Price ID: price_xxxxx" or
- Just "ID: plan_xxxxx"

**Click the copy icon 📋 or select and copy the text**

---

## What If I Don't See Any Plans?

If you see this instead:

```
┌───────────────────────────────────────────────┐
│ PRICING / PLANS                   [+ Add Plan] │
├───────────────────────────────────────────────┤
│                                               │
│  No plans configured yet                     │ ← NO PLANS!
│                                               │
│  [+ Add Plan] button                         │
└───────────────────────────────────────────────┘
```

**You need to create a plan first!**

### How to Add a Plan:

1. **Click "[+ Add Plan]" button**
2. **Fill in the form:**
   ```
   Plan Name: One-time Purchase
   Price: 100.00
   Currency: USD
   Type: ☑️ One-time payment (NOT subscription)
   ```
3. **Click "Create" or "Save"**
4. **Copy the generated Plan ID**

---

## Alternative: Check "Developer Settings"

Sometimes Plan IDs are visible in Developer Settings:

```
https://dash.whop.com/settings/developer
```

Scroll down to see:

```
┌─────────────────────────────────────────────┐
│  API Keys                                    │
│  Your API Key: LksDE8D5... [Show] [Copy]   │
│                                             │
│  Products & Plans                           │
│  ┌─────────────────────────────────────┐   │
│  │ Product: $100 Store Credits         │   │
│  │ prod_dh2QndgU9J79o                 │   │
│  │                                     │   │
│  │ Plans:                              │   │
│  │ • plan_abc123xyz ($100.00)         │   │ ← HERE!
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Quick Checklist

- [ ] I opened https://dash.whop.com
- [ ] I clicked "Products" in the sidebar
- [ ] I clicked on my "$100 Store Credits" product
- [ ] I found the "Plans" or "Pricing" section
- [ ] I can see a Plan ID starting with `plan_`
- [ ] I copied the Plan ID
- [ ] I updated `src/lib/credits.ts` line 304

---

## Common Mistakes

### ❌ WRONG: Using Product ID
```typescript
whopPlanId: "prod_dh2QndgU9J79o"  // This won't work!
```

### ✅ CORRECT: Using Plan ID
```typescript
whopPlanId: "plan_abc123xyz"  // This works!
```

---

## After You Find It

Update your code in `src/lib/credits.ts`:

```typescript
{
  id: "pkg_100",
  name: "$100 Credits",
  amount: 10000,
  price: 10000,
  bonus: 2000,
  description: "Best value - get 20% bonus!",
  whopPlanId: "plan_abc123xyz", // ← Paste your actual Plan ID here
  enabled: true,
}
```

Restart your dev server:
```bash
npm run dev
```

Test the purchase flow:
```
http://localhost:3000/credits
```

---

## Still Stuck?

1. **Take a screenshot** of your Whop dashboard product page
2. **Show me** what you see (DM or paste in chat)
3. **I'll point out** exactly where the Plan ID is

Or contact Whop Support: https://whop.com/support

---

## Summary

**What you have**: `prod_dh2QndgU9J79o` (Product ID)
**What you need**: `plan_xxxxx` (Plan ID)
**Where to find it**: Dashboard → Products → [Your Product] → Plans section
**What it looks like**: `plan_abc123xyz` or `price_def456ghi`
**Update file**: `src/lib/credits.ts` line 304

Good luck! 🚀
