# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Starts Next.js development server with Turbopack
- **Build**: `npm run build` - Creates production build with Turbopack
- **Start**: `npm run start` - Runs production server
- **Lint**: `npm run lint` - Runs ESLint

## High-Level Architecture

Fiyova is a modern e-commerce platform built with Next.js 15, integrating with Dodo Payments for complete payment processing.

### Core Architecture Patterns

**Server vs Client Components**:
- Server Components for data fetching (products, product details) to avoid client-side API calls
- Client Components for interactive elements (buttons, forms, checkout flow)
- Pattern: Fetch data in Server Components, pass as props to Client Components

**API Route Structure**:
- `/api/dodo/products` - Product management and listing
- `/api/dodo/customers` - Customer creation
- `/api/dodo/payments` - Payment link generation
- `/api/webhooks/dodo` - Payment webhook handling

### Payment Flow

1. Product Selection → Server Component fetches products
2. Checkout Initiation → Client Component handles form submission
3. Customer Creation → API route creates customer in Dodo
4. Payment Creation → API route generates payment link
5. Redirect → User goes to Dodo's checkout page
6. Success Handling → Redirect back with query parameters

### Key Technical Patterns

**Dodo Payments Integration**:
- API Key in environment variables (`DODO_PAYMENTS_API_KEY`)
- Test/Live mode configuration via `DODO_MODE`
- SDK initialization in `src/lib/dodo.ts`
- Always include `billing` object in payment requests
- Extract `items` from nested API responses: `response?.items || response || []`

**Slug Mapping System**:
- Utility in `src/lib/product-slug.ts` with `buildSlugMap()` function
- Bidirectional mapping between slugs and product IDs for SEO-friendly URLs
- Consistent usage across all product-related components

**Error Handling**:
- API routes wrapped in try-catch with JSON error responses
- Client components show user-friendly error messages
- Graceful degradation when APIs fail

## Important Implementation Details

### Environment Variables
```bash
DODO_PAYMENTS_API_KEY=<api_key>
DODO_MODE=test|live
DODO_REDIRECT_URL=http://localhost:3000/checkout/complete
```

### Common Issues and Solutions

**Context Errors**: "createContext only works in Client Components"
- Solution: Move Button usage to separate Client Components
- Files: `src/components/products/product-actions.tsx`, `src/components/products/product-card-actions.tsx`

**Payment Link Retrieval**: Dodo API response field names vary
- Solution: Try multiple field names: `payment_link_url`, `payment_link`, `checkout_url`, `url`, `link`

**Missing Required Fields**: 422 errors for missing `billing` field
- Solution: Always include default billing object in payment requests

## Key Files

### Critical Files
- `src/lib/dodo.ts` - Dodo client configuration
- `src/lib/product-slug.ts` - Slug mapping utilities
- `src/app/api/dodo/payments/route.ts` - Payment processing
- `src/app/checkout/complete/page.tsx` - Payment success handling

### Page Structure
- `src/app/page.tsx` - Landing page with product listing
- `src/app/products/page.tsx` - Product catalog
- `src/app/products/[slug]/page.tsx` - Individual product pages
- `src/app/checkout/page.tsx` - Checkout flow

### Component Organization
- `src/components/products/*` - Reusable product components
- `src/components/ui/*` - UI components (shadcn/ui)
- `src/components/site/*` - Site-wide components

## Memory Bank

The project includes a memory bank directory (`memory-bank/`) containing comprehensive documentation:
- `projectbrief.md` - Project overview and requirements
- `systemPatterns.md` - Architecture patterns and technical decisions
- `activeContext.md` - Current implementation context
- `progress.md` - Development progress tracking

Always read memory bank files at the start of each session for context.