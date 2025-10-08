# Custom Amount Credit Purchase System

## Overview

This system allows customers to purchase store credits with **any amount they choose** instead of fixed packages. Customers can top up from $1.00 to $10,000.00.

## How It Works

### Customer Flow

1. **Visit Credits Page** (`/credits`)
2. **Enter Custom Amount** - Type any amount or use quick select buttons
3. **Validate** - System validates minimum ($1) and maximum ($10,000)
4. **Purchase** - Click "Purchase Credits" button
5. **Payment** - Whop processes the payment
6. **Instant Credit** - Credits added automatically to account

### User Interface Features

#### Amount Input
- Large, prominent input field with dollar sign
- Real-time validation
- Error messages for invalid amounts
- Auto-formatting to 2 decimal places

#### Quick Select Buttons
Pre-set amounts for convenience:
- $10
- $25
- $50
- $100
- $250
- $500

#### Current Balance Display
- Shows user's current credit balance
- Updates after successful purchase

#### Validation Rules
- **Minimum**: $1.00
- **Maximum**: $10,000.00
- **Format**: Numbers and decimal point only
- **Decimals**: Max 2 decimal places

## Technical Implementation

### API Endpoint

**POST `/api/credits/purchase`**

Request:
```json
{
  "amount": 50.00,
  "userId": "user@example.com",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "charge": { ... },
  "amount": 5000,
  "formatted": "$50.00"
}
```

### Whop Integration

Uses Whop's `chargeUser()` method which supports custom amounts:

```typescript
const charge = await whopSdk.payments.chargeUser({
  amount: amountInCents, // Custom amount in cents
  currency: "USD",
  userId: userEmail,
  metadata: {
    type: "credit_purchase",
    userId,
    userEmail,
    userName,
    creditAmount: amountInCents,
    totalCredits: amountInCents,
  },
});
```

### Frontend Component

**Location**: `src/app/credits/page.tsx`

Key features:
- Custom amount input with validation
- Quick select buttons
- Real-time error handling
- Loading states
- Success feedback

### Validation Logic

```typescript
const validateAmount = (value: string): boolean => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    setAmountError("Please enter a valid amount");
    return false;
  }

  if (numValue < 1) {
    setAmountError("Minimum amount is $1.00");
    return false;
  }

  if (numValue > 10000) {
    setAmountError("Maximum amount is $10,000.00");
    return false;
  }

  setAmountError("");
  return true;
};
```

### Input Sanitization

```typescript
const handleAmountChange = (value: string) => {
  // Only allow numbers and one decimal point
  const sanitized = value.replace(/[^\d.]/g, '');
  const parts = sanitized.split('.');

  // Prevent multiple decimal points
  if (parts.length > 2) return;

  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) return;

  setAmount(sanitized);
  validateAmount(sanitized);
};
```

## Webhook Handling

When payment succeeds, Whop sends a webhook:

```typescript
// In /api/webhooks/whop
case "payment.succeeded": {
  const metadata = payment.metadata;

  if (metadata?.type === "credit_purchase") {
    const userId = metadata.userId;
    const totalCredits = metadata.totalCredits;

    // Add credits to user account
    addCredits(userId, totalCredits, "Credit purchase", metadata);
  }
  break;
}
```

## User Experience Benefits

✅ **Flexibility** - Buy exactly what you need
✅ **No Waste** - Don't pay for unused credits
✅ **Quick Options** - Fast selection with preset buttons
✅ **Clear Validation** - Immediate feedback on valid amounts
✅ **Transparent** - See exactly what you'll receive

## Advantages Over Fixed Packages

| Fixed Packages | Custom Amount |
|----------------|---------------|
| Limited choices (4-5 options) | Unlimited choices ($1-$10,000) |
| May buy more than needed | Buy exact amount needed |
| Requires managing multiple SKUs | Single flexible endpoint |
| Fixed bonus tiers | Simple 1:1 conversion |
| Complex pricing logic | Straightforward pricing |

## Configuration

### Adjust Limits

Edit `src/app/api/credits/purchase/route.ts`:

```typescript
// Minimum amount
if (amountInCents < 100) { // $1.00
  return NextResponse.json({
    success: false,
    error: "Minimum purchase amount is $1.00"
  });
}

// Maximum amount
if (amountInCents > 1000000) { // $10,000.00
  return NextResponse.json({
    success: false,
    error: "Maximum purchase amount is $10,000.00"
  });
}
```

### Customize Quick Select Amounts

Edit `src/app/credits/page.tsx`:

```typescript
const quickAmounts = [10, 25, 50, 100, 250, 500]; // Change these values
```

## Testing

### Test Flow

1. Navigate to `/credits`
2. Try entering various amounts:
   - Valid: 10, 25.50, 100, 500
   - Invalid: 0, 0.50, 15000
3. Click quick select buttons
4. Complete purchase with test payment
5. Verify credits added to account

### Test Cases

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Minimum valid | $1.00 | Accepted |
| Below minimum | $0.99 | Error: "Minimum amount is $1.00" |
| Maximum valid | $10,000.00 | Accepted |
| Above maximum | $10,001.00 | Error: "Maximum amount is $10,000.00" |
| Decimal places | $25.123 | Auto-limited to $25.12 |
| Invalid chars | $25abc | Sanitized to $25 |
| Empty | "" | Error: "Please enter a valid amount" |
| Quick select | Click $50 | Input populated with $50 |

## Security Considerations

### Server-Side Validation

✅ Amount validated on server (API route)
✅ Cannot bypass client-side validation
✅ Protected against manipulation

### Input Sanitization

✅ Only numbers and decimal point allowed
✅ Max 2 decimal places
✅ No script injection possible

### Payment Security

✅ All payments processed through Whop
✅ No credit card data touches your server
✅ Webhook signature validation
✅ Idempotent transaction handling

## Troubleshooting

### Credits Not Added After Payment

**Check:**
1. Webhook is configured in Whop dashboard
2. Webhook secret matches `.env.local`
3. Server logs for webhook errors
4. Metadata contains `totalCredits` field

### Amount Not Accepting Decimals

**Solution:**
- Use decimal point (.) not comma (,)
- Maximum 2 decimal places
- Example: 25.50 ✅, 25,50 ❌

### Purchase Button Disabled

**Reasons:**
1. No amount entered
2. Amount validation error
3. Not logged in
4. Purchase in progress

### Payment Fails

**Check:**
1. Whop API key is correct
2. Test mode vs Live mode
3. User has valid Whop account
4. Server logs for specific error

## Migration from Fixed Packages

If you're migrating from the fixed package system:

### 1. Keep Old Package Data (Optional)

The package system still exists in `src/lib/credits.ts` but is not used by the new custom amount flow. You can keep it for reference or remove it.

### 2. Update Any Package References

Search for `packageId` usage in your codebase and update to `amount`:

```typescript
// Old
purchaseCredits(packageId, userId, email, name)

// New
purchaseCredits(amount, userId, email, name)
```

### 3. Test Thoroughly

Test the new custom amount flow before removing package system code.

## Future Enhancements

### Suggested Amount Based on Cart

```typescript
// Calculate suggested amount based on cart total
const cartTotal = cart.items.reduce((sum, item) => sum + item.price, 0);
const suggested = Math.ceil(cartTotal / 100) * 100; // Round up to nearest $1
```

### Promotional Bonuses

```typescript
// Add bonus credits for larger amounts
let bonus = 0;
if (amountInCents >= 10000) bonus = amountInCents * 0.1; // 10% bonus for $100+
if (amountInCents >= 50000) bonus = amountInCents * 0.2; // 20% bonus for $500+

const totalCredits = amountInCents + bonus;
```

### Save Favorite Amounts

```typescript
// Save user's frequently used amounts
const favoriteAmounts = getUserFavoriteAmounts(userId);
// Display as quick select options
```

### Gift Credits

```typescript
// Allow users to gift custom amounts to others
const giftCredits = async (amount, recipientEmail) => {
  // Purchase credits
  // Transfer to recipient
  // Send notification
};
```

## Support

For issues with custom amount purchases:

1. Check server logs for errors
2. Verify Whop API configuration
3. Test webhook delivery in Whop dashboard
4. Review validation rules match business needs

---

**Last Updated**: 2025-10-08
**Version**: 2.0.0 (Custom Amount)
**Status**: Production Ready
