# Troubleshooting Guide

## Issue 1: ngrok Closes Immediately

### Symptoms
- ngrok starts and then closes immediately
- Command window flashes and disappears

### Solutions

#### Solution 1: Sign Up and Add Auth Token (Recommended)

1. **Sign up for ngrok** (free):
   - Go to: https://dashboard.ngrok.com/signup
   - Create a free account

2. **Get your auth token**:
   - After signing up, you'll see your auth token
   - Or go to: https://dashboard.ngrok.com/get-started/your-authtoken

3. **Add auth token**:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

4. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

#### Solution 2: Use Command Prompt (Not PowerShell)

Sometimes ngrok has issues with PowerShell:

1. Open **Command Prompt** (not PowerShell)
2. Run: `ngrok http 3000`

#### Solution 3: Check if Port 3000 is Running

ngrok needs your dev server running first:

1. **Terminal 1** - Start dev server:
   ```bash
   npm run dev
   ```

2. **Terminal 2** - Start ngrok:
   ```bash
   ngrok http 3000
   ```

#### Solution 4: Reinstall ngrok

```bash
npm uninstall -g ngrok
npm install -g ngrok
ngrok config add-authtoken YOUR_TOKEN
ngrok http 3000
```

---

## Issue 2: Not Redirecting to Whop Gateway

### Symptoms
- Click "Purchase Credits" button
- Nothing happens or shows error
- No redirect to Whop payment page

### Check API Response

Open browser console (F12) and check for errors when clicking purchase button.

### Possible Causes & Solutions

#### Cause 1: Whop API Error

**Check server logs:**
Look for error messages like:
```
Whop API error: { message: '...' }
```

**Common Whop API Errors:**

1. **Invalid API Key**
   - Verify `WHOP_API_KEY` in `.env.local` is correct
   - Make sure there are no extra spaces
   - Restart server after changing

2. **Payment Links Not Enabled**
   - Go to Whop Dashboard
   - Enable "Payment Links" feature for your app
   - Some Whop apps need this feature activated

3. **Wrong API Endpoint**
   - Whop API might use different endpoint
   - Check Whop docs for correct payment link endpoint

#### Cause 2: API Key Not Loaded

**Solution:**
```bash
# Stop server (Ctrl+C)
# Restart server
npm run dev
```

Environment variables are only loaded on server start.

#### Cause 3: CORS or Network Error

**Check:**
- Browser console for network errors
- Server logs for request errors

#### Cause 4: Whop API Version

If payment links endpoint doesn't exist, try alternative approach:

**Option A: Use Whop SDK method** (if available)
**Option B: Use Stripe instead** (easier for custom amounts)
**Option C: Create fixed-price plans in Whop**

---

## Issue 3: Webhook Not Receiving Events

### Check Webhook Configuration

1. **Verify URL in Whop Dashboard**:
   - Should be: `https://your-ngrok-url.ngrok.io/api/webhooks/whop`
   - Must use HTTPS (ngrok provides this)
   - Must end with `/api/webhooks/whop`

2. **Verify Events Selected**:
   - `payment.succeeded` must be checked
   - Save webhook after selecting events

3. **Check ngrok is Running**:
   - ngrok must be running when webhook fires
   - If ngrok restarts, update URL in Whop

4. **Verify Webhook Secret**:
   ```bash
   # In .env.local
   WHOP_WEBHOOK_SECRET=ws_xxxxx
   ```
   - Must match Whop dashboard
   - Restart server after adding

### Test Webhook Delivery

1. **Make a test purchase**
2. **Check ngrok logs**:
   - Go to: http://localhost:4040
   - See all requests coming through ngrok
   - Look for POST to `/api/webhooks/whop`

3. **Check server logs**:
   ```
   Whop webhook received: payment.succeeded
   Credits added successfully
   ```

4. **Check Whop Dashboard**:
   - Go to Webhooks section
   - View webhook delivery history
   - Check for success/failure status

---

## Issue 4: Credits Not Added After Payment

### Symptoms
- Payment successful in Whop
- No credits added to account
- Balance unchanged

### Debugging Steps

#### Step 1: Check Webhook Received

**Server logs should show:**
```
Whop webhook received: payment.succeeded
```

If not shown:
- Webhook not configured correctly
- ngrok not running
- URL mismatch

#### Step 2: Check Webhook Validation

**If you see:**
```
Webhook validation failed
```

**Solution:**
- Verify `WHOP_WEBHOOK_SECRET` matches dashboard
- Restart server
- Check signature header is being sent

#### Step 3: Check Metadata

**Webhook should contain:**
```json
{
  "metadata": {
    "type": "credit_purchase",
    "userId": "user@example.com",
    "totalCredits": 5000
  }
}
```

If metadata is missing:
- Payment link didn't include metadata
- API call needs to be fixed

#### Step 4: Check Credits Added

**Server logs should show:**
```
Credits added successfully: { userId: '...', amount: 5000 }
```

If error occurs:
- Check `data/credit-balances.json` exists
- Check file permissions
- Check userId format matches

---

## Issue 5: API Errors

### "Failed to create payment link"

**Check:**
1. Whop API key is valid
2. API endpoint is correct
3. Payment links feature is enabled in Whop

**Alternative:**
Use development mode temporarily:
- Credits add directly without payment
- Good for testing UI flow
- Not for production

### "amount and userId are required"

**Cause:**
- Form not sending data correctly

**Solution:**
- Check user is logged in
- Check amount field has value
- Check browser console for errors

### "Minimum purchase amount is $1.00"

**Cause:**
- Amount is less than $1

**Solution:**
- Enter amount ≥ $1.00
- Check input validation

---

## General Debugging Steps

### 1. Check Environment Variables

```bash
# In .env.local, verify all are set:
WHOP_API_KEY=xxx
NEXT_PUBLIC_WHOP_APP_ID=app_xxx
WHOP_WEBHOOK_SECRET=ws_xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Restart Everything

```bash
# Stop all processes
# Ctrl+C on dev server
# Ctrl+C on ngrok

# Start fresh
npm run dev          # Terminal 1
ngrok http 3000      # Terminal 2
```

### 3. Check Server Logs

Watch for:
- API errors
- Webhook events
- Credit additions
- Any error messages

### 4. Check Browser Console

Press F12, look for:
- Network errors
- JavaScript errors
- Failed API calls

### 5. Test Each Part Separately

**Test API:**
```bash
curl -X POST http://localhost:3000/api/credits/purchase \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "userId": "test@test.com", "userEmail": "test@test.com", "userName": "Test"}'
```

**Expected Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://whop.com/...",
  "sessionId": "..."
}
```

---

## Quick Fixes

### Restart Server After ENV Changes

Always restart after changing `.env.local`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Clear Browser Cache

Sometimes old code is cached:
1. Press Ctrl+Shift+R (hard refresh)
2. Or clear browser cache
3. Or use incognito mode

### Check Port 3000 Available

```bash
# Windows
netstat -ano | findstr :3000

# If port in use, kill process or use different port
npm run dev -- -p 3001
ngrok http 3001
```

---

## Getting Help

### Check Logs

1. **Server logs** - Terminal running `npm run dev`
2. **ngrok logs** - Terminal running ngrok
3. **ngrok web interface** - http://localhost:4040
4. **Browser console** - F12 in browser
5. **Whop dashboard** - Webhook delivery logs

### Useful Information to Provide

When asking for help, include:
- Error message (exact text)
- Server logs
- Browser console errors
- Which step failed
- What you've tried already

---

## Contact Support

**Whop Support:**
- Docs: https://docs.whop.com
- Email: support@whop.com
- Dashboard: Check for support chat

**ngrok Support:**
- Docs: https://ngrok.com/docs
- Status: https://status.ngrok.com

---

## Development Mode

If you just want to test the UI without payment processing:

The current code will work without Whop if the API call fails:
- Credits won't add automatically
- But you can test the interface
- Useful for development

To enable development mode explicitly, see:
`docs/WHOP_CUSTOM_AMOUNT_INTEGRATION.md`

