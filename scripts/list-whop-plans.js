/**
 * Whop Plan ID Finder
 * This script lists all plans in your Whop account
 * Run: node scripts/list-whop-plans.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const WHOP_API_KEY = process.env.WHOP_API_KEY;

if (!WHOP_API_KEY) {
  console.error('❌ Error: WHOP_API_KEY not found in .env.local');
  process.exit(1);
}

async function listPlans() {
  console.log('🔍 Fetching all plans from Whop...\n');

  try {
    const response = await fetch('https://api.whop.com/api/v5/plans', {
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Response:', errorText);
      return;
    }

    const data = await response.json();

    console.log('✅ Success! Found plans:\n');
    console.log('='.repeat(60));

    if (data.data && data.data.length > 0) {
      data.data.forEach((plan, index) => {
        console.log(`\n📦 Plan ${index + 1}:`);
        console.log(`   Plan ID: ${plan.id}`);
        console.log(`   Name: ${plan.name || 'Unnamed'}`);
        console.log(`   Price: $${(plan.amount / 100).toFixed(2)}`);
        console.log(`   Type: ${plan.type || 'N/A'}`);
        console.log(`   Product ID: ${plan.product_id || 'N/A'}`);
        console.log(`   Status: ${plan.status || 'active'}`);
        console.log('-'.repeat(60));
      });

      console.log('\n\n📋 COPY THESE PLAN IDs:\n');
      data.data.forEach((plan) => {
        const price = (plan.amount / 100).toFixed(2);
        console.log(`$${price}: ${plan.id}`);
      });

      console.log('\n\n💡 Update src/lib/credits.ts with these Plan IDs');

    } else {
      console.log('⚠️  No plans found in your Whop account.');
      console.log('\nYou need to create plans first:');
      console.log('1. Go to https://dash.whop.com');
      console.log('2. Navigate to Products');
      console.log('3. Create or edit a product');
      console.log('4. Add pricing plans (e.g., $10, $25, $50, $100)');
    }

  } catch (error) {
    console.error('❌ Error fetching plans:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your WHOP_API_KEY in .env.local');
    console.error('2. Make sure your API key is valid');
    console.error('3. Verify you have products/plans in your Whop dashboard');
  }
}

// Also try to list products
async function listProducts() {
  console.log('\n\n🔍 Fetching all products from Whop...\n');

  try {
    const response = await fetch('https://api.whop.com/api/v5/products', {
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();

    console.log('✅ Success! Found products:\n');
    console.log('='.repeat(60));

    if (data.data && data.data.length > 0) {
      data.data.forEach((product, index) => {
        console.log(`\n📦 Product ${index + 1}:`);
        console.log(`   Product ID: ${product.id}`);
        console.log(`   Name: ${product.name || 'Unnamed'}`);
        console.log(`   Description: ${product.description || 'N/A'}`);

        // Show plans if included
        if (product.plans && product.plans.length > 0) {
          console.log(`   Plans:`);
          product.plans.forEach(plan => {
            console.log(`      - ${plan.id} ($${(plan.amount / 100).toFixed(2)})`);
          });
        }
        console.log('-'.repeat(60));
      });
    } else {
      console.log('⚠️  No products found.');
    }

  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}

// Run both
(async () => {
  await listPlans();
  await listProducts();
})();
