# Whop Webhook Setup Guide

## What You Need

- ✅ Whop account with an app created
- ✅ Local development server running
- ✅ ngrok installed (for local testing)

## Step-by-Step Setup

### 1. Start Your Development Server

```bash
npm run dev
```

Your server will run at `http://localhost:3000`

### 2. Install and Run ngrok

**Install:**
```bash
npm install -g ngrok
```

**Run (in a new terminal):**
```bash
ngrok http 3000
```

**Output will show:**
```
Session Status    online
Forwarding        https://1234-56-78-90.ngrok.io -> http://localhost:3000
```

Copy the HTTPS forwarding URL (e.g., `https://1234-56-78-90.ngrok.io`)

### 3. Configure Webhook in Whop Dashboard

1. **Go to Whop Dashboard**
   - Visit: https://whop.com/dashboard
   - Navigate to your app

2. **Find Webhooks Section**
   - Look for "Webhooks" or "Developer Settings"
   - Click "Add Webhook" or "Create Webhook"

3. **Enter Webhook Details**
   - **Endpoint URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/whop`
   - Example: `https://1234-56-78-90.ngrok.io/api/webhooks/whop`

4. **Select Events**
   - ✅ `payment.succeeded` (required)
   - ✅ `payment.failed` (optional)
   - ✅ `subscription.created` (optional)
   - ✅ `subscription.cancelled` (optional)

5. **Save Webhook**
   - Whop will generate a **Webhook Secret**
   - Copy this secret (looks like: `whsec_xxxxxxxxxxxxxxxxxx`)

### 4. Update Environment Variables

Open `.env.local` and add:

```bash
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
```

**Complete `.env.local` should look like:**
```bash
# Dodo Payments (Legacy)
DODO_PAYMENTS_API_KEY=wXRR4tdONpxWeZjQ.8wY2fbFMFEGwcFwOPT05DSSdYOVDQFo7Teb8DF9edIH-HhLM
DODO_REDIRECT_URL=http://localhost:3000/checkout/complete
DODO_MODE=live
DODO_WEBHOOK_KEY=whsec_m60GCYbF/4vLSfHko8mkykj0TmQ8xcCa

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Whop Payments Configuration
WHOP_API_KEY=fG0INeXabp2DOdwY3mpAOKuU2OlytkUNxmnXmARpbZg
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx  # ← Add this
```

### 5. Restart Your Server

Stop and restart your dev server to load the new environment variable:

```bash
# Press Ctrl+C to stop
npm run dev
```

### 6. Test the Webhook

**Check the webhook endpoint is accessible:**
```bash
curl https://your-ngrok-url.ngrok.io/api/webhooks/whop
```

You should see a response (even if it says method not allowed for GET).

**Test with a real payment:**
1. Go to your app and purchase credits
2. Complete payment in Whop
3. Check your server logs for webhook received
4. Verify credits were added to your account

## Webhook Endpoint Code

Your webhook handler is at: `src/app/api/webhooks/whop/route.ts`

It already:
- ✅ Validates webhook signatures
- ✅ Handles `payment.succeeded` events
- ✅ Adds credits automatically
- ✅ Logs all events

## Troubleshooting

### Webhook Not Receiving Events

**Check:**
1. ✅ ngrok is running
2. ✅ Dev server is running
3. ✅ Webhook URL in Whop matches ngrok URL exactly
4. ✅ Path ends with `/api/webhooks/whop`
5. ✅ Events are selected in Whop dashboard

**Verify webhook is reachable:**
```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/webhooks/whop
```

### Signature Validation Failed

**Check:**
1. ✅ `WHOP_WEBHOOK_SECRET` in `.env.local` matches Whop dashboard
2. ✅ Server restarted after adding secret
3. ✅ No extra spaces in the secret

### Credits Not Added After Payment

**Check:**
1. ✅ Webhook received (check server logs)
2. ✅ Event type is `payment.succeeded`
3. ✅ Metadata contains `type: "credit_purchase"`
4. ✅ Metadata contains `userId` and `totalCredits`

**View server logs:**
Look for:
```
Whop webhook received: payment.succeeded
Credits added successfully: { userId: '...', transactionId: '...', amount: 5000 }
```

## ngrok Tips

### Keep the Same URL

Free ngrok gives you a new URL each time you restart. To keep the same URL:

**Option 1: ngrok Paid Plan**
- Get a static subdomain
- URL never changes

**Option 2: Update Webhook URL Each Time**
- Get new ngrok URL
- Update in Whop dashboard
- Only takes 30 seconds

### ngrok Web Interface

View webhook requests in real-time:
```
http://localhost:4040
```

This shows all HTTP requests going through ngrok.

## Production Deployment

When deploying to production:

1. **Deploy your app** (Vercel, Railway, etc.)
2. **Get production URL**
   - Example: `https://fiyova.com`
   - Or: `https://fiyova.vercel.app`

3. **Update Whop webhook URL**
   - Change from: `https://xyz.ngrok.io/api/webhooks/whop`
   - To: `https://fiyova.com/api/webhooks/whop`

4. **Update environment variables**
   - Set `WHOP_WEBHOOK_SECRET` in production
   - Set `NEXT_PUBLIC_BASE_URL` to production URL

5. **Test in production**
   - Make a real purchase
   - Verify webhook delivered
   - Check credits added

## Security Notes

✅ **Always validate webhook signatures** (already implemented)
✅ **Use HTTPS** (ngrok provides this automatically)
✅ **Keep webhook secret secure** (never commit to git)
✅ **Log webhook events** (for debugging and audit trail)

## Webhook Event Examples

### payment.succeeded
```json
{
  "type": "payment.succeeded",
  "data": {
    "id": "pay_xxxxx",
    "amount": 5000,
    "currency": "USD",
    "metadata": {
      "type": "credit_purchase",
      "userId": "user@example.com",
      "totalCredits": 5000
    }
  }
}
```

### payment.failed
```json
{
  "type": "payment.failed",
  "data": {
    "id": "pay_xxxxx",
    "error": "card_declined"
  }
}
```

## Testing Checklist

- [ ] ngrok installed and running
- [ ] Dev server running on port 3000
- [ ] Webhook URL configured in Whop dashboard
- [ ] Webhook URL ends with `/api/webhooks/whop`
- [ ] Events selected in Whop
- [ ] Webhook secret copied to `.env.local`
- [ ] Server restarted after adding secret
- [ ] Test payment completed
- [ ] Webhook received (check logs)
- [ ] Credits added to account
- [ ] Balance updated in header
- [ ] Transaction appears in history

## Quick Reference

**Your webhook endpoint:**
```
https://your-ngrok-url.ngrok.io/api/webhooks/whop
```

**Start ngrok:**
```bash
ngrok http 3000
```

**View ngrok requests:**
```
http://localhost:4040
```

**Check webhook works:**
```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/webhooks/whop
```

---

**Need Help?**
- Whop Docs: https://docs.whop.com
- ngrok Docs: https://ngrok.com/docs

