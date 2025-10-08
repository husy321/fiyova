/**
 * Whop Plan ID Finder using SDK
 * Run: node scripts/find-plan-ids.mjs
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

console.log('\n📋 Whop Configuration Check\n');
console.log('='.repeat(60));
console.log(`WHOP_API_KEY: ${process.env.WHOP_API_KEY ? '✅ Found' : '❌ Missing'}`);
console.log(`NEXT_PUBLIC_WHOP_APP_ID: ${process.env.NEXT_PUBLIC_WHOP_APP_ID || '❌ Missing'}`);
console.log('='.repeat(60));

console.log('\n\n📖 HOW TO FIND YOUR PLAN IDs:\n');
console.log('Since Whop API endpoints are not publicly documented,');
console.log('you need to find Plan IDs from your Whop Dashboard:\n');

console.log('Step 1: Go to Whop Dashboard');
console.log('   → https://dash.whop.com\n');

console.log('Step 2: Navigate to Products');
console.log('   → Click "Products" in the left sidebar\n');

console.log('Step 3: Open Your Product');
console.log('   → Click on "$100 Store Credits" (or your product name)\n');

console.log('Step 4: Find the Plans Section');
console.log('   → Look for "Plans", "Pricing", or "Price Points"');
console.log('   → This shows all pricing options for your product\n');

console.log('Step 5: Copy the Plan ID');
console.log('   → Look for IDs starting with "plan_" or "price_"');
console.log('   → Example: plan_abc123xyz\n');

console.log('Step 6: Update Your Code');
console.log('   → Edit: src/lib/credits.ts');
console.log('   → Replace placeholder IDs with your actual Plan IDs\n');

console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANT:');
console.log('   Product ID (prod_xxxxx) ≠ Plan ID (plan_xxxxx)');
console.log('   You currently have: prod_dh2QndgU9J79o');
console.log('   This is a PRODUCT ID, not a PLAN ID!\n');
console.log('   You need to find the PLAN ID inside that product.\n');

console.log('='.repeat(60));
console.log('\n💡 WHAT TO LOOK FOR IN DASHBOARD:\n');
console.log('When you open your product page, you should see something like:\n');
console.log('   Product: "$100 Store Credits"');
console.log('   Product ID: prod_dh2QndgU9J79o\n');
console.log('   └── Plans:');
console.log('       ├── Plan 1: One-time Purchase');
console.log('       │   Price: $100.00');
console.log('       │   Plan ID: plan_abc123xyz  ← COPY THIS!\n');
console.log('       ├── Plan 2: Monthly Subscription (if any)');
console.log('       │   Price: $10.00/month');
console.log('       │   Plan ID: plan_def456ghi\n');

console.log('='.repeat(60));
console.log('\n🎯 NEXT STEPS:\n');
console.log('1. Open Whop Dashboard: https://dash.whop.com');
console.log('2. Go to Products → Your Product');
console.log('3. Find the Plan ID (starts with plan_)');
console.log('4. Update src/lib/credits.ts line 304');
console.log('5. Create 3 more products for $10, $25, $50');
console.log('6. Get their Plan IDs too\n');

console.log('📚 Full guide: docs/WHOP_PLAN_ID_DEEP_DIVE.md\n');
