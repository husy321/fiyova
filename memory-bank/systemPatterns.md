# System Patterns: Fiyova Architecture

## System Architecture
Fiyova follows a modern Next.js 15 architecture with clear separation between server and client components, integrated with Dodo Payments API.

## Key Technical Decisions

### 1. Server vs Client Components
- **Server Components**: Used for data fetching (products, product details)
- **Client Components**: Used for interactive elements (buttons, forms, checkout flow)
- **Pattern**: Fetch data in Server Components, pass as props to Client Components

### 2. Data Fetching Strategy
```typescript
// Server Component pattern
async function getProducts() {
  const response = await fetch('/api/dodo/products');
  return response.json();
}

// Client Component pattern
"use client";
function Products({ products }) {
  // Interactive UI logic
}
```

### 3. API Route Structure
- **Products**: `/api/dodo/products` - List all products
- **Product Details**: `/api/dodo/products/[id]` - Get specific product
- **Customers**: `/api/dodo/customers` - Create customer
- **Payments**: `/api/dodo/payments` - Create payment link
- **Webhooks**: `/api/webhooks/dodo` - Handle payment updates

### 4. Error Handling Pattern
```typescript
// API Routes
try {
  const result = await dodoClient.operation();
  return NextResponse.json(result);
} catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}

// Client Components
if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Component Relationships

### Product Flow
```
Landing Page (Server) 
  → Products Component (Client)
    → Product Cards (Client)
      → Product Detail Page (Server)
        → Product Actions (Client)
          → Checkout Page (Client)
            → Success Page (Client)
```

### API Integration
```
Frontend Components
  → API Routes (/api/dodo/*)
    → Dodo Client (lib/dodo.ts)
      → Dodo Payments API
```

## Design Patterns

### 1. Slug Mapping
- Products use slugs for SEO-friendly URLs
- `buildSlugMap()` utility creates bidirectional mapping
- Consistent slug generation across all components

### 2. Payment Flow
- Customer creation → Payment creation → Redirect → Success handling
- Query parameters passed through redirect URL
- Status-based UI rendering

### 3. Caching Strategy
- API routes include `Cache-Control` headers
- Server-side fetching reduces client-side API calls
- Graceful fallbacks when APIs are unavailable

## Key Files and Their Roles

### Core Files
- `src/app/page.tsx` - Landing page with product fetching
- `src/app/products/page.tsx` - Product catalog
- `src/app/products/[slug]/page.tsx` - Product details
- `src/app/checkout/page.tsx` - Payment initiation
- `src/app/checkout/complete/page.tsx` - Payment completion

### API Routes
- `src/app/api/dodo/products/route.ts` - Product management
- `src/app/api/dodo/customers/route.ts` - Customer creation
- `src/app/api/dodo/payments/route.ts` - Payment processing
- `src/app/api/webhooks/dodo/route.ts` - Webhook handling

### Utilities
- `src/lib/dodo.ts` - Dodo client configuration
- `src/lib/product-slug.ts` - Slug mapping utilities
- `src/components/products/*` - Reusable product components
